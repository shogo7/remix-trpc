import {
  z,
  ZodTypeAny,
  ZodObject,
  ZodRawShape,
  ZodOptional,
  ZodNullable,
} from "zod";
import { Schema, SchemaTypeOptions } from "mongoose";

/* 変換結果で使う型 */
type MType = SchemaTypeOptions<unknown> | Schema | [unknown];

/* optional() / nullable() を剥がして中身の純粋な型を得る */
function unwrapType(zodType: ZodTypeAny): ZodTypeAny {
  while (
    zodType instanceof ZodOptional ||
    zodType instanceof ZodNullable
  ) {
    zodType = zodType._def.innerType;
  }
  return zodType;
}

/* ---------------- ここがエントリポイント ---------------- */
export function zodToMongooseSchema<T extends ZodRawShape>(
  obj: ZodObject<T>
): Schema {
  const shape = obj.shape;
  const mongooseShape: Record<string, MType> = {};

  for (const key in shape) {
    const field = shape[key];
    const isOptional = field.isOptional?.() || field.isNullable?.();
    const baseType = unwrapType(field);

    const schemaType = zodFieldToMongoose(baseType);
    mongooseShape[key] = {
      ...schemaType,
      required: !isOptional,
    };
  }

  return new Schema(mongooseShape, { timestamps: true });
}

/* ---------- Zod の型ごとに Mongoose の型へ ---------- */
function zodFieldToMongoose(zodType: ZodTypeAny): MType {
  if (zodType instanceof z.ZodString) {
    return {
      type: String,
      ...extractStringRules(zodType),
    } as SchemaTypeOptions<unknown>;
  }

  if (zodType instanceof z.ZodNumber) {
    return {
      type: Number,
      ...extractNumberRules(zodType),
    } as SchemaTypeOptions<unknown>;
  }

  if (zodType instanceof z.ZodBoolean) {
    return { type: Boolean } as SchemaTypeOptions<unknown>;
  }

  if (zodType instanceof z.ZodDate) {
    return { type: Date } as SchemaTypeOptions<unknown>;
  }

  if (zodType instanceof z.ZodArray) {
    return [
      zodFieldToMongoose(
        (zodType as z.ZodArray<ZodTypeAny>).element
      ),
    ];
  }

  if (zodType instanceof z.ZodObject) {
    return zodToMongooseSchema(zodType);
  }

  /* fallback → Mixed */
  return { type: Schema.Types.Mixed } as SchemaTypeOptions<unknown>;
}

/* ---------- 文字列制約を抽出 ---------- */
function extractStringRules(
  zodStr: z.ZodString
): SchemaTypeOptions<string> {
  const rule: SchemaTypeOptions<string> = { trim: true };

  const checks = zodStr._def.checks;
  for (const check of checks) {
    if (check.kind === "min") rule.minlength = check.value;
    if (check.kind === "max") rule.maxlength = check.value;
    if (check.kind === "email") rule.match = /.+@.+\..+/;
    if (check.kind === "url") rule.match = /^https?:\/\//;
  }
  return rule;
}

/* ---------- 数値制約を抽出 ---------- */
function extractNumberRules(
  zodNum: z.ZodNumber
): SchemaTypeOptions<number> {
  const rule: SchemaTypeOptions<number> = {};

  const checks = zodNum._def.checks;
  for (const check of checks) {
    if (check.kind === "min") rule.min = check.value;
    if (check.kind === "max") rule.max = check.value;
    if (check.kind === "int") rule.validate = Number.isInteger;
  }
  return rule;
}

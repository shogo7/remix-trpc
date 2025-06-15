import { Model, Document, Types } from "mongoose";

export async function findByIdAndUserOrThrow<
  T extends Document & { userId: Types.ObjectId }
>(
  model: Model<T>,
  id: string,
  userId: Types.ObjectId,
  label: string
): Promise<T> {
  const doc = await model.findById(id);
  if (!doc) {
    throw new Error(`${label}が存在しません`);
  }

  if (!doc.userId.equals(userId)) {
    throw new Error(`${label}の所有者ではありません`);
  }

  return doc;
}

// controllers/fruit.ts
import { Fruit } from "../models/fruit.js";
import type { FruitType } from "../models/fruit.js";


export async function getAllFruits(): Promise<FruitType[]> {
  const fruits = await Fruit.find().lean();
  return fruits.map((fruit) => ({
    ...fruit,
    _id: fruit._id.toString(),
  }));
}

export async function getFruitById(id: string): Promise<FruitType> {
  const fruit = await Fruit.findById(id).lean();
  if (!fruit) throw new Error("Not found");
  return {
    ...fruit,
    _id: fruit._id.toString(),
  };
}

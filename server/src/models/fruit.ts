// server/src/models/fruit.ts
import mongoose from "mongoose";

const fruitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Fruit = mongoose.model("Fruit", fruitSchema);

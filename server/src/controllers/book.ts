// server/src/controllers/book.ts

import { BookModel } from "../models/book.js";
import { Book } from "../../../shared/schemas/book.js";

export async function getAllBooks(): Promise<Book[]> {
  return BookModel.getAll();
}

export async function getBookById(id: string): Promise<Book | null> {
  return BookModel.getById(id) ?? null;
}

export async function createBook(data: {
  title: string;
  content: string;
}): Promise<Book> {
  return BookModel.create(data);
}

export async function updateBook(
  id: string,
  data: { title?: string; content?: string }
): Promise<Book | null> {
  return BookModel.update(id, data);
}

export async function deleteBook(id: string): Promise<boolean> {
  return BookModel.delete(id);
}

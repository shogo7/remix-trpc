// server/src/models/book.ts
import { Book, CreateBookInput } from "../../../shared/schemas/book.js";

// メモリ内のデータストアとして配列を使用
const books: Book[] = [];

export const BookModel = {
  getAll: () => books,
  getById: (id: string) => books.find((book) => book.id === id),
  create: (book: CreateBookInput) => {
    const newBook: Book = {
      id: Math.random().toString(36).substring(7),
      ...book,
      createdAt: new Date(),
    };
    books.push(newBook);
    return newBook;
  },
  update: (id: string, book: Partial<CreateBookInput>) => {
    const index = books.findIndex((p) => p.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...book };
    return books[index];
  },
  delete: (id: string) => {
    const index = books.findIndex((p) => p.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  },
};

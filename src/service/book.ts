import { ObjectId } from "mongoose";
import { Book } from "../model/interface/book";
import { BookRepository } from "../repository/book";
import { AppError } from "../utils/appError";

const bookRepository = new BookRepository();
export class BookService {
    async create(title: string, author: string, editor: string, publisher: string, type: string, category: string, bookCover: string, bookFile: string):Promise<Book> {
        const existingBook = await bookRepository.findOne({ bookFile });
        if (existingBook) {
            throw new AppError("Book already exists", 400);
        }
        const book = await bookRepository.create({ title, author, editor, publisher, type, category, bookCover, bookFile });
        if(!book) throw new AppError("Book not created",500)
        return book;
    }

    async getAllBooks():Promise<Book[]> {
        const books = await bookRepository.find({});
        return books;
    }

    async getBookById(bookId: string):Promise<Book | null> {
        const book = await bookRepository.findById(bookId);
        return book ? book : null;
    }

    async update(bookId: string, title: string, author: string, editor: string, publisher: string, type: string, category: string, bookCover: string, bookFile: string):Promise<Book> {
        const book = await bookRepository.findOneAndUpdate({_id:bookId}, {title, author, editor, publisher, type, category, bookCover, bookFile});
        if(!book) throw new AppError("Book not updated",500)
        return book;
    }

    async delete(bookId: string):Promise<Book> {
        const book = await bookRepository.deleteById(bookId);
        if(!book) throw new AppError("Book not deleted",500)
        return book;
    }

    async countBooks():Promise<number> {
        const count = await bookRepository.countDocuments();
        return count;
    }
}
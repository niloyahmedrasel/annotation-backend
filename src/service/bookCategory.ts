import { BookCategory } from "../model/interface/bookCategory";
import { BookCategoryRepository } from "../repository/bookCategory";
import { AppError } from "../utils/appError";

const bookCategoryRepository = new BookCategoryRepository();
export class BookCategpryService {
    async create(title: string): Promise<BookCategory> {
        const book = await bookCategoryRepository.create({ title });
        if(!book) throw new AppError("Book category not created",400);
        return book;
    }

    async getAllBookCategories(): Promise<BookCategory[]> {
        const bookCategories = await bookCategoryRepository.find({});
        return bookCategories;
    }

    async getBookCategoryById(bookCategoryId: string): Promise<BookCategory> {
        const bookCategory = await bookCategoryRepository.findById(bookCategoryId);
        if(!bookCategory) throw new AppError("Book category not found",404);
        return bookCategory;
    }

    async delete(bookCategoryId: string): Promise<BookCategory> {
        const bookCategory = await bookCategoryRepository.deleteById(bookCategoryId);
        if(!bookCategory) throw new AppError("Book category not deleted",400);
        return bookCategory;
    }

    async update(bookCategoryId: string, title: string): Promise<BookCategory> {
        const bookCategory = await bookCategoryRepository.findOneAndUpdate({ _id: bookCategoryId }, { title });
        if(!bookCategory) throw new AppError("Book category not updated",400);
        return bookCategory;
    }
}
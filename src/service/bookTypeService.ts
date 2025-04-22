import { BookType } from "../model/interface/bookType";
import { BookTypeRepository } from "../repository/bookType";
import { AppError } from "../utils/appError";

const bookTypeRepository = new BookTypeRepository();
export class BookTypeService {
    async create(title: string): Promise<BookType> {
        const bookType = await bookTypeRepository.create({ title }); 
        if(!bookType) throw new AppError("Book type not created",500);
        return bookType;
    }

    async getAllBookTypes(): Promise<BookType[]> {
        const bookTypes = await bookTypeRepository.find({});
        if(!bookTypes) throw new AppError("Book types not found",500);
        return bookTypes;
    }

    async getBookTypeById(bookTypeId: string): Promise<BookType> {
        const bookType = await bookTypeRepository.findById(bookTypeId);
        if(!bookType) throw new AppError("Book type not found",500);
        return bookType;
    }

    async update(bookTypeId: string, title: string): Promise<BookType> {
        const bookType = await bookTypeRepository.findOneAndUpdate({ _id: bookTypeId }, { title } );
        if(!bookType) throw new AppError("Book type not updated",500);
        return bookType;
    }

    async delete(bookTypeId: string): Promise<BookType> {
        const bookType = await bookTypeRepository.deleteById(bookTypeId);
        if(!bookType) throw new AppError("Book type not deleted",500);
        return bookType;
    }
}
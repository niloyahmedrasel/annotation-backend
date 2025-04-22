import { Author } from "../model/interface/author";
import { AuthorRepository } from "../repository/author";
import { AppError } from "../utils/appError";

const authorRepository = new AuthorRepository();
export class AuthorService {
    async create(title: string): Promise<Author> {
        const author = await authorRepository.create({ title });
        return author;
    }

    async update(authorId: string, title: string): Promise<Author> {
        const author = await authorRepository.findOneAndUpdate({ _id: authorId }, { title });
        if (!author) throw new AppError("Author not found", 404);
        return author;
    }

    async delete(authorId: string): Promise<Author> {
        const author = await authorRepository.deleteById(authorId);
        if (!author) throw new AppError("Author not found",404);
        return author;
    }

    async getAllAuthors(): Promise<Author[]> {
        const authors = await authorRepository.find({});
        return authors;
    }

    async getAuthorById(authorId: string): Promise<Author> {
        const author = await authorRepository.findOne({ _id: authorId });
        if (!author) throw new AppError("Author not found", 404);
        return author;
    }


}
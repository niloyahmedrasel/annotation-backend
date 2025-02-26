
import { BookModel } from "../model/book";
import { Book } from "../model/interface/book";
import { baseRepository } from "./baseRepository";
export class BookRepository extends baseRepository<Book> {
    constructor() {
        super(BookModel);
    }
}
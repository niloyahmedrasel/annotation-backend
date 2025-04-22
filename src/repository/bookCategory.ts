
import { BookCategoryModel } from "../model/bookCategory";
import { BookCategory } from "../model/interface/bookCategory";
import { baseRepository } from "./baseRepository";
export class BookCategoryRepository extends baseRepository<BookCategory> {
    constructor() {
        super(BookCategoryModel);
    }
}

import { BookTypeModel } from "../model/bookType";
import { BookType } from "../model/interface/bookType";
import { baseRepository } from "./baseRepository";
export class BookTypeRepository extends baseRepository<BookType> {
    constructor() {
        super(BookTypeModel);
    }
}
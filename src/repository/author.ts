
import { AuthorModel } from "../model/author";
import { Author } from "../model/interface/author";
import { baseRepository } from "./baseRepository";
export class AuthorRepository extends baseRepository<Author> {
    constructor() {
        super(AuthorModel);
    }
}
import { User } from "../model/interface/user";
import { UserModel } from "../model/user";
import { baseRepository } from "./baseRepository";

export class UserRepository extends baseRepository<User> {
    constructor() {
        super(UserModel);
    }
}
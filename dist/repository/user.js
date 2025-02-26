"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_1 = require("../model/user");
const baseRepository_1 = require("./baseRepository");
class UserRepository extends baseRepository_1.baseRepository {
    constructor() {
        super(user_1.UserModel);
    }
}
exports.UserRepository = UserRepository;

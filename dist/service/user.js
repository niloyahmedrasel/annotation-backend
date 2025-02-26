"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../repository/user");
const appError_1 = require("../utils/appError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userRepository = new user_1.UserRepository();
class UserService {
    create(name, email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                name,
                email,
                password,
                role
            };
            if (!user) {
                throw new appError_1.AppError("Bad Request", 400);
            }
            const createdUser = yield userRepository.create(user);
            if (!createdUser) {
                throw new appError_1.AppError("Bad Request", 400);
            }
            return createdUser;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findById(userId);
            if (!user) {
                throw new appError_1.AppError('User not found', 404);
            }
            return user;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userRepository.find({});
            if (users.length === 0) {
                throw new appError_1.AppError('No users found', 404);
            }
            return users;
        });
    }
    update(userId, name, email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findById(userId);
            if (!user) {
                throw new appError_1.AppError('User not found', 404);
            }
            const updatedUser = yield userRepository.findOneAndUpdate({ _id: userId }, { name, email, password, role });
            if (!updatedUser) {
                throw new appError_1.AppError('User not updated', 500);
            }
            return updatedUser;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !password) {
                throw new appError_1.AppError('Bad Request: Email and password are required', 400);
            }
            const user = yield userRepository.findOne({ email });
            if (!user) {
                throw new appError_1.AppError('User not found', 404);
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new appError_1.AppError('Invalid password', 401);
            }
            return user;
        });
    }
    grantPermissions(userId, role, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findById(userId);
            if (!user) {
                throw new appError_1.AppError('User not found', 404);
            }
            if (user.role !== 'Super Admin') {
                throw new appError_1.AppError('Only Super Admin users can grant permissions', 403);
            }
            const allUserByRole = yield userRepository.find({ role });
            if (allUserByRole.length === 0) {
                throw new appError_1.AppError('No users found with the specified role', 404);
            }
            const updatedUsers = yield userRepository.updateMany({ role }, { $push: { pemissions: permission } });
            if (updatedUsers.length === 0) {
                throw new appError_1.AppError('No users updated', 500);
            }
            return updatedUsers;
        });
    }
}
exports.UserService = UserService;

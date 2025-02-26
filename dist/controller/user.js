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
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../service/user");
const appError_1 = require("../utils/appError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userService = new user_1.UserService();
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, role } = req.body;
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const user = yield userService.create(name, email, hashedPassword, role);
                res.status(201).json({ message: "User created successfully", user });
            }
            catch (error) {
                console.log(error);
                const statusCode = error instanceof appError_1.AppError ? error.statusCode : 500;
                const message = error instanceof appError_1.AppError ? error.message : "An unexpected error occurred";
                res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService.getAllUsers();
                res.status(200).json({ message: "Users fetched successfully", users });
            }
            catch (error) {
                console.log(error);
                const statusCode = error instanceof appError_1.AppError ? error.statusCode : 500;
                const message = error instanceof appError_1.AppError ? error.message : "An unexpected error occurred";
                res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield userService.getUserById(userId);
                res.status(200).json({ message: "User fetched successfully", user });
            }
            catch (error) {
                console.log(error);
                const statusCode = error instanceof appError_1.AppError ? error.statusCode : 500;
                const message = error instanceof appError_1.AppError ? error.message : "An unexpected error occurred";
                res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { name, email, password, role } = req.body;
                const user = yield userService.update(userId, name, email, password, role);
                res.status(200).json({ message: "User updated successfully", user });
            }
            catch (error) {
                console.log(error);
                const statusCode = error instanceof appError_1.AppError ? error.statusCode : 500;
                const message = error instanceof appError_1.AppError ? error.message : "An unexpected error occurred";
                res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userService.login(email, password);
                if (!user) {
                    throw new appError_1.AppError("User not found", 404);
                }
                const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, permissions: user.permissions }, process.env.JWT_SECRET, { expiresIn: "1d" });
                res.status(200).json({ message: "User logged in successfully", user, token });
            }
            catch (error) {
                console.log(error);
                const statusCode = error instanceof appError_1.AppError ? error.statusCode : 500;
                const message = error instanceof appError_1.AppError ? error.message : "An unexpected error occurred";
                res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
            }
        });
    }
    grantPermissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const { role, permission } = req.body;
                const user = yield userService.grantPermissions(userId, role, permission);
                res.status(200).json({ message: "Permissions granted successfully", user });
            }
            catch (error) {
                console.log(error);
                const statusCode = error instanceof appError_1.AppError ? error.statusCode : 500;
                const message = error instanceof appError_1.AppError ? error.message : "An unexpected error occurred";
                res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
            }
        });
    }
}
exports.UserController = UserController;

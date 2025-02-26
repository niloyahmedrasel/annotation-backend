"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controller/user");
const authenticateUser_1 = require("../middleware/authenticateUser");
const authorizeUserRole_1 = require("../middleware/authorizeUserRole");
router.post("/", authenticateUser_1.authenticateUser, (0, authorizeUserRole_1.authorizeRoles)(["Super Admin"]), new user_1.UserController().create);
router.get("/", authenticateUser_1.authenticateUser, new user_1.UserController().getAllUsers);
router.get("/:userId", authenticateUser_1.authenticateUser, new user_1.UserController().getUserById);
router.post("/login", new user_1.UserController().login);
router.post("/:userId", authenticateUser_1.authenticateUser, new user_1.UserController().grantPermissions);
router.put("/:userId", authenticateUser_1.authenticateUser, new user_1.UserController().update);
exports.default = router;

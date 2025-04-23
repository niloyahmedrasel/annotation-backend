import express from "express";
const router = express.Router();
import { BookCategoryController } from "../controller/bookCategory";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";
import { checkUserPermission } from "../middleware/checkUserPermission";

router.post("/",authenticateUser,authorizeRoles(["Super Admin"]), new BookCategoryController().create);
router.get("/",authenticateUser,checkUserPermission("Create books"), new BookCategoryController().getAllBookCategories);
router.get("/:bookCategoryId",authenticateUser, new BookCategoryController().getBookCategoryById);
router.put("/:bookCategoryId",authenticateUser,authorizeRoles(["Super Admin"]), new BookCategoryController().update);
router.delete("/:bookCategoryId",authenticateUser,authorizeRoles(["Super Admin"]), new BookCategoryController().delete);

export default router
import express from "express";
const router = express.Router();
import { BookController } from "../controller/book";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";
import { authorizePermissions } from "../middleware/authPermission";
import upload from "../middleware/uploadFiles";

router.post("/",authenticateUser,authorizeRoles(["Super Admin"]),upload.fields([
    { name: "bookCover", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]), new BookController().create);
router.get("/",authenticateUser, new BookController().getAllBooks);
router.get("/:bookId",authenticateUser, new BookController().getBookById);
router.put("/:bookId",authenticateUser,authorizeRoles(["Super Admin"]), new BookController().update);
router.delete("/:bookId",authenticateUser,authorizeRoles(["Super Admin"]), new BookController().delete);
router.get("/count/count-books", new BookController().countBooks);

export default router
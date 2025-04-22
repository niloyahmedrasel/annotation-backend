import express from "express";
const router = express.Router();
import { AuthorController } from "../controller/author";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";

router.post("/",authenticateUser,authorizeRoles(["annotator","Super Admin"]), new AuthorController().create);
router.get("/",authenticateUser, new AuthorController().getAllAuthors);
router.get("/:authorId",authenticateUser, new AuthorController().getAuthorById);
router.put("/:authorId",authenticateUser,authorizeRoles(["Super Admin"]), new AuthorController().update);
router.delete("/:authorId",authenticateUser,authorizeRoles(["Super Admin"]), new AuthorController().delete);

export default router
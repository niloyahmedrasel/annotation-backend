import express from "express";
const router = express.Router();
import { TagController } from "../controller/tag";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";

router.post("/",authenticateUser,authorizeRoles(["annotator","Super Admin"]), new TagController().create);
router.get("/",authenticateUser, new TagController().getAllTags);
router.get("/:tagId",authenticateUser, new TagController().getTagById);
router.put("/:tagId",authenticateUser,authorizeRoles(["Super Admin"]), new TagController().update);
router.delete("/:tagId",authenticateUser,authorizeRoles(["Super Admin"]), new TagController().delete);

export default router
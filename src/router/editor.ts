import express from "express";
const router = express.Router();
import { EditorController } from "../controller/editor";
import { authenticateUser } from "../middleware/authenticateUser";  
import { authorizeRoles } from "../middleware/authorizeUserRole";

router.post("/",authenticateUser,authorizeRoles(["annotator","Super Admin"]), new EditorController().create);
router.get("/",authenticateUser, new EditorController().getAllEditors);
router.get("/:editorId",authenticateUser, new EditorController().getEditorById);
router.put("/:editorId",authenticateUser,authorizeRoles(["Super Admin"]), new EditorController().update);
router.delete("/:editorId",authenticateUser,authorizeRoles(["Super Admin"]), new EditorController().delete);

export default router
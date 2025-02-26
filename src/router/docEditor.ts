import express from "express";
const router = express.Router();

import { DocEditorController } from "../controller/docEditor";
import { authenticateUser } from "../middleware/authenticateUser";

router.get("/view-doc/:bookId",authenticateUser, new DocEditorController().openDocEditor);

export default router
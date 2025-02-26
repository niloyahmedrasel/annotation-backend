import express from "express";
const router = express.Router();
import { BookTypeController } from "../controller/bookType";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";
import { authorizePermissions } from "../middleware/authPermission";

router.post("/",authenticateUser,authorizeRoles(["Super Admin"]), new BookTypeController().create);
router.get("/",authenticateUser, new BookTypeController().getAllBookTypes);
router.get("/:bookTypeId",authenticateUser, new BookTypeController().getBookTypeById);
router.put("/:bookTypeId",authenticateUser,authorizeRoles(["Super Admin"]), new BookTypeController().update);
router.delete("/:bookTypeId",authenticateUser,authorizeRoles(["Super Admin"]), new BookTypeController().delete);

export default router
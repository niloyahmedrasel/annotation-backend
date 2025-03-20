import express from "express";
const router = express.Router();
import { PermissionController } from "../controller/permission";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";

router.post("/", authenticateUser, authorizeRoles(["Super Admin"]), new PermissionController().create);
router.get("/", authenticateUser, new PermissionController().getAllPermissions);
router.get("/:permissionId", authenticateUser, new PermissionController().getPermissionById);
router.put("/:permissionId", authenticateUser, authorizeRoles(["Super Admin"]), new PermissionController().update);
router.delete("/:permissionId", authenticateUser, authorizeRoles(["Super Admin"]), new PermissionController().delete);
router.post("/add-action", authenticateUser, authorizeRoles(["Super Admin"]), new PermissionController().addAction);
router.get("/count/count-permissions", new PermissionController().countPermissions);
router.post("/create-permission-group", authenticateUser, authorizeRoles(["Super Admin"]), new PermissionController().createCategory);

export default router
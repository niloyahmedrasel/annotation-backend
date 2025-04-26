import express from "express";
const router = express.Router();
import { UserController } from "../controller/user";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";
import upload from "../middleware/uploadFiles";
import { checkUserPermission } from "../middleware/checkUserPermission";

router.post("/",authenticateUser,checkUserPermission("Create user"), new UserController().create);
router.get("/",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().getAllUsers);
router.get("/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().getUserById);
router.post("/login",new UserController().login);
router.post("/grant-permission/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().grantPermissions);
router.post("/remove-permission/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().removePermissions);
router.put("/:userId",authenticateUser,authorizeRoles(["Super Admin"]),checkUserPermission("Edit user"),new UserController().update);
router.get("/count/count-users",new UserController().countUsers);
router.delete("/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().deleteUser);
router.get("/get-permissions/:userId",authenticateUser,new UserController().getPermissionByUserId);
router.post("/freeze-user/:userId",authenticateUser,authorizeRoles(["Super Admin"]),checkUserPermission("Freeze users"),new UserController().frezeUser);
router.post("/unfreeze-user/:userId",authenticateUser,authorizeRoles(["Super Admin"]),checkUserPermission("Unfreeze users"),new UserController().unfrezeUser);





export default router
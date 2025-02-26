import express from "express";
const router = express.Router();
import { UserController } from "../controller/user";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";
import upload from "../middleware/uploadFiles";

router.post("/", new UserController().create);
router.get("/",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().getAllUsers);
router.get("/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().getUserById);
router.post("/login",new UserController().login);
router.post("/grant-permission/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().grantPermissions);
router.post("/remove-permission/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().removePermissions);
router.put("/:userId",authenticateUser,authorizeRoles(["Super Admin"]),new UserController().update);



export default router
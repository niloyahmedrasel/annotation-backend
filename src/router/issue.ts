import express from "express";
const router = express.Router();
import { IssueController } from "../controller/issue";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";

router.post("/",authenticateUser,authorizeRoles(["annotator","Super Admin"]), new IssueController().create);
router.get("/",authenticateUser, new IssueController().getAllIssues);
router.get("/:issueId",authenticateUser, new IssueController().getIssueById);
router.put("/:issueId",authenticateUser,authorizeRoles(["annotator"]), new IssueController().update);
router.delete("/:issueId",authenticateUser,authorizeRoles(["annotator"]), new IssueController().delete);

export default router;
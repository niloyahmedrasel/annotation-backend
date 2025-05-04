import express from "express";
const router = express.Router();
import { IssueController } from "../controller/issue";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeRoles } from "../middleware/authorizeUserRole";
import { checkUserPermission } from "../middleware/checkUserPermission";

router.post("/",authenticateUser,authorizeRoles(["annotator","Super Admin"]),checkUserPermission("Create issue within a scope"), new IssueController().create);
router.get("/",authenticateUser,checkUserPermission("Read-only issues within a scope"), new IssueController().getAllIssues);
router.get("/:issueId",authenticateUser, new IssueController().getIssueById);
router.put("/:issueId",authenticateUser,authorizeRoles(["Super Admin"]),checkUserPermission("Edit issues within a scope"), new IssueController().update);
router.delete("/:issueId",authenticateUser,authorizeRoles(["Super Admin"]), new IssueController().delete);
router.post("/annotate-issue",authenticateUser,checkUserPermission("Create annotation within a scope"), new IssueController().annotateIssue);
router.get("/get-csrf-token", new IssueController().getCSRFToken);
router.get("/count/count-issues", new IssueController().countIssues);

export default router;
import express from "express";
const router = express.Router();
import { PublisherController } from "../controller/publisher";
import { authenticateUser } from "../middleware/authenticateUser";

router.post("/",authenticateUser, new PublisherController().create);
router.get("/",authenticateUser, new PublisherController().getAllPublishers);
router.get("/:publisherId",authenticateUser, new PublisherController().getPublisherById);
router.put("/:publisherId",authenticateUser, new PublisherController().update);
router.delete("/:publisherId",authenticateUser, new PublisherController().delete);

export default router
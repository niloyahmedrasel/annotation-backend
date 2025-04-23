import express from "express";
const router = express.Router();
import { ShamelaScraperController } from "../controller/shamelaScrapper";
import { authenticateUser } from "../middleware/authenticateUser";
import { checkUserPermission } from "../middleware/checkUserPermission";

router.post("/scrape",authenticateUser,checkUserPermission("Scrap from Shamela"), new ShamelaScraperController().scrape);
router.get("/scraped-documents",authenticateUser, new ShamelaScraperController().getScrapedDocuments);
router.get("/scraped-documents/:id",authenticateUser, new ShamelaScraperController().getScrapedDocumentById);

export default router
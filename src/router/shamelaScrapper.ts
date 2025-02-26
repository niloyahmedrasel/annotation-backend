import express from "express";
const router = express.Router();

import { ShamelaScrapperController } from "../controller/shamelaScrapper";

router.post("/scrape", new ShamelaScrapperController().scrapeBook);

export default router
import  mongoose from "mongoose";
import { Scraper } from "./interface/shamelaScrapper";

const scraperSchema = new mongoose.Schema<Scraper>({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ScraperModel = mongoose.model<Scraper>('Scraper', scraperSchema);

import  mongoose from "mongoose";
import { Scraper } from "./interface/shamelaScrapper";

const scraperSchema = new mongoose.Schema<Scraper>({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Unknown'
    },
    fileType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'In Review',
        enum: ['In Review', 'Published', 'Unpublished']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bookNumber: {
        type: String,
        required: true
    },
    pageNumber: {
        type: String,
        required: true
    },
    volume: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    }
});

export const ScraperModel = mongoose.model<Scraper>('Scraper', scraperSchema);

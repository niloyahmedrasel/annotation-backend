
import mongoose, { Schema } from "mongoose";
import { Scraper } from "./interface/shamelaScrapper";

const shamelaScrapperSchema = new mongoose.Schema<Scraper>({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Annotated", "Not Annotated"],
        default: "Not Annotated",
        required: true
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
}, {
    timestamps: true
}
);

export const ScraperModel = mongoose.model<Scraper>("Scraper", shamelaScrapperSchema);

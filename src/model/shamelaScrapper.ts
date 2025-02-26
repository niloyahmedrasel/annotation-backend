import mongoose from "mongoose";
import { ShamelaScrapper } from "./interface/shamelaScrapper";

// Update the content field to be an array of strings
export const shamelaScrapperSchema = new mongoose.Schema<ShamelaScrapper>({
    url: {
        type: String,
        required: true
    },
    content: {
        type: [String], // Array of strings
        required: true
    },
}, {
    timestamps: true
});

export const ShamelaScrapperModel = mongoose.model<ShamelaScrapper>("ShamelaScrapper", shamelaScrapperSchema);

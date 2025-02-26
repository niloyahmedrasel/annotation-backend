import mongoose from "mongoose";
import { ShamelaScrapper } from "./interface/shamelaScrapper";

export const shamelaScrapperSchema = new mongoose.Schema<ShamelaScrapper>({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export const ShamelaScrapperModel = mongoose.model<ShamelaScrapper>("ShamelaScrapper", shamelaScrapperSchema);
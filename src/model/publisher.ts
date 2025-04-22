import { Publisher } from "./interface/publisher";
import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema<Publisher>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const PublisherModel = mongoose.model<Publisher>("Publisher", publisherSchema);
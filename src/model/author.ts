import mongoose from "mongoose";
import { Author } from "./interface/author";

const authorSchema = new mongoose.Schema<Author>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const AuthorModel = mongoose.model<Author>("Author", authorSchema);
import mongoose from "mongoose";
import { BookType } from "./interface/bookType";

const bookTypeSchema = new mongoose.Schema<BookType>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const BookTypeModel = mongoose.model<BookType>("BookType", bookTypeSchema);
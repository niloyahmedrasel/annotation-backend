import mongoose, { Schema } from "mongoose";
import { Book } from "./interface/book";

const bookSchema = new mongoose.Schema<Book>({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    editor: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    bookCover: {
        type: String,
        required: true
    },
    bookFile: {
        type: String,
        required: true
    }
    
}, {
    timestamps: true
});

export const BookModel = mongoose.model<Book>('Book', bookSchema);
import mongoose from "mongoose"
import { BookCategory } from "./interface/bookCategory"
const BookCategorSchema = new mongoose.Schema<BookCategory>({
    title: {
        type: String,
        required: true
    }
   }, 
   {
    timestamps: true
   })

export const BookCategoryModel = mongoose.model<BookCategory>("BookCategory", BookCategorSchema);
import { Document, ObjectId } from "mongoose";

export interface Issue extends Document {
    title: string;
    description: string;
    bookId: ObjectId;
    tagId: ObjectId;
    scholarId: ObjectId;
    categoryId: ObjectId;
    date:Date
    status: string;
}
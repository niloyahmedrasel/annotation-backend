import { Document } from "mongoose";

export interface Author extends Document {
    title: string;
}
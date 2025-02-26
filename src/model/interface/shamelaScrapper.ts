import { Document } from "mongoose";

export interface ShamelaScrapper extends Document {
    url: string;
    content: string[]; // Updated to an array of strings
}

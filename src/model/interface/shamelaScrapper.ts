import { Document } from "mongoose";

export interface ShamelaScrapper extends Document {
    title: string;
    content: string; 
}
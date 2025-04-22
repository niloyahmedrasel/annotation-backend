import { Document } from "mongoose";

export interface Tag extends Document {
    title: string;
}
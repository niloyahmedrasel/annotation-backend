import { Document } from "mongoose";

export interface Publisher extends Document {
    title: string;
}

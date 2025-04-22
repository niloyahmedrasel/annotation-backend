import mongoose from "mongoose";
import { Tag } from "./interface/tag";

const tagSchema = new mongoose.Schema<Tag>({
    title: {
        type: String,
        required: true
    }
    }, 
    {
        timestamps: true
    }
);

export const TagModel = mongoose.model<Tag>("Tag", tagSchema);
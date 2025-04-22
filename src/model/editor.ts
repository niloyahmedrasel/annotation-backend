import { Editor } from "./interface/editor";
import mongoose from "mongoose";

const editorSchema = new mongoose.Schema<Editor>({
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const EditorModel = mongoose.model<Editor>("Editor", editorSchema);
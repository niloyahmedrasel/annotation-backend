import mongoose from "mongoose";
import { Issue } from "./interface/issue";

const issueSchema = new mongoose.Schema<Issue>({
    title: {
        type: String,
        required: true
    },
    bookNumber:{
        type: String,
        required: true
    },
    pageNumber: {
        type: String,
        required: true
    },
    volume: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Annotated", "Not Annotated"],
        default: "Not Annotated",
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const IssueModel = mongoose.model<Issue>("Issue", issueSchema);
export default IssueModel

import mongoose from "mongoose";
import { Issue } from "./interface/issue";

const issueSchema = new mongoose.Schema<Issue>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    tagId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    },
    scholarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholar',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: {
        type: String,
        enum: ['published', 'under review', 'draft'],
        default: 'draft'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const IssueModel = mongoose.model<Issue>("Issue", issueSchema);
export default IssueModel

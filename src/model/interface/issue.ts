import { Document, ObjectId } from "mongoose";

export interface Issue extends Document {
  title: string;
  status: string;
  bookNumber: string;
  pageNumber: string;
  volume: string;
  chapter: string;
  tags: [string];
  issue: string;
  createdBy:string;
}
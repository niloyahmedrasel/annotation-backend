import { Document } from 'mongoose';

export interface Scraper extends Document {
  title: string;
  author: string;
  fileType: string;
  createdAt: Date;
  status: string;
  bookNumber: string;
  pageNumber: string;
  volume: string;
  chapter: string;
}
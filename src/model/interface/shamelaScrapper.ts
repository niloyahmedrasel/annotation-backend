import { Document } from 'mongoose';

export interface Scraper extends Document {
  fileName: string;
  fileType: string;
  createdAt: Date;
}
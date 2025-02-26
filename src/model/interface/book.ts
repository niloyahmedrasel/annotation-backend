import { Document, ObjectId } from "mongoose";

export interface Book extends Document {
title: string;
author: string;
editor:string;
publisher:string;
type:string;
category:string;
bookCover:string;
bookFile:string;
}
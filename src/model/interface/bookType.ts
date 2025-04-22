import { Document } from "mongoose"

export interface BookType extends Document {
    title: string
}
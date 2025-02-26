import { Document } from "mongoose"

export interface BookType extends Document {
    type: string
    description: string
}
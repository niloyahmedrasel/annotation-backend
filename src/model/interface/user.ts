import { Document, ObjectId } from "mongoose";
export interface User extends Document {
    name:string,
    email: string,
    password: string,
    role: string,
    permissions:[ObjectId],
    isfreeze: boolean
}
import { Document } from "mongoose";

export interface Action extends Document{
    name:string
}
export interface Permission extends Document{
    category: string;
    action:[Action];
}
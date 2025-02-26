import { User } from "./interface/user";
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema<User>({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    permissions: {
        type: [{type:Schema.Types.ObjectId, ref:"Permission"}],
    },
    isfreeze: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}
);

export const UserModel = mongoose.model<User>("User", userSchema);

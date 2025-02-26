import mongoose from "mongoose";
import { Permission } from "./interface/permission";

const permissionSchema = new mongoose.Schema<Permission>({
    category: {
        type: String,
        required: true
    },
    action: [{
        name: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

export const PermissionModel = mongoose.model<Permission>("Permission", permissionSchema);
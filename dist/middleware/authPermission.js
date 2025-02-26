"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = void 0;
const authorizePermissions = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const hasPermission = requiredPermissions.every(permission => req.user.permissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
        }
        next();
    };
};
exports.authorizePermissions = authorizePermissions;

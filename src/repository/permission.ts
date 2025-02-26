import { Permission } from "../model/interface/permission";
import { PermissionModel } from "../model/permission";
import { baseRepository } from "./baseRepository";

export class PermissionRepository extends baseRepository<Permission> {
    constructor() {
        super(PermissionModel);
    }
}

import { Issue } from "../model/interface/issue";
import IssueModel from "../model/issue";
import { baseRepository } from "./baseRepository";
export class IssueRepository extends baseRepository<Issue> {
    constructor() {
        super(IssueModel);
    }
}
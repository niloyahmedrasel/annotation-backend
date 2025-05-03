import { ObjectId } from "mongoose";
import { Issue } from "../model/interface/issue";
import { IssueRepository } from "../repository/issue";

const issueRepository = new IssueRepository()
export class IssueService {
    async create(title:string,bookNumber:string,pageNumber:string,volume:string,chapter:string,tags:[string],issue:string,createdBy:string):Promise<Issue> {
        const generatedIssue = await issueRepository.create({title,bookNumber,pageNumber,volume,chapter,tags,issue,createdBy});
        if(!generatedIssue) throw new Error("Issue not created");
        return generatedIssue;
    }

    async getAllIssues():Promise<Issue[]> {
        const issues = await issueRepository.find({});
        if(!issues) throw new Error("Issues not found");
        return issues;
    }

    async getIssueById(issueId:string):Promise<Issue> {
        const issue = await issueRepository.findById(issueId);
        if(!issue) throw new Error("Issue not found");
        return issue;
    }

    async update(issueId:string,title:string,bookNumber:string,pageNumber:string,volume:string,chapter:string,tags:[string],issue:string,createdBy:string):Promise<Issue> {
        const updatedIssue = await issueRepository.findOneAndUpdate({_id:issueId},{title,bookNumber,pageNumber,volume,chapter,tags,issue,createdBy});
        if(!updatedIssue) throw new Error("Issue not updated");
        return updatedIssue;
    }

    async delete(issueId:string):Promise<Issue> {
        const issue = await issueRepository.deleteById(issueId);
        if(!issue) throw new Error("Issue not deleted");
        return issue;
    }
}
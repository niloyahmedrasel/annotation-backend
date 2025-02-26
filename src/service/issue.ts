import { ObjectId } from "mongoose";
import { Issue } from "../model/interface/issue";
import { IssueRepository } from "../repository/issue";

const issueRepository = new IssueRepository()
export class IssueService {
    async create(title:string,description:string,bookId:ObjectId,tagId:ObjectId,scholarId:ObjectId,categoryId:ObjectId,date:Date,status:string):Promise<Issue> {
        const issue = await issueRepository.create({title,description,bookId,tagId,scholarId,categoryId,date,status});
        if(!issue) throw new Error("Issue not created");
        return issue;
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

    async update(issueId:string,title:string,description:string,bookId:ObjectId,tagId:ObjectId,scholarId:ObjectId,categoryId:ObjectId,date:Date,status:string):Promise<Issue> {
        const issue = await issueRepository.findOneAndUpdate({_id:issueId},{title,description,bookId,tagId,scholarId,categoryId,date,status});
        if(!issue) throw new Error("Issue not updated");
        return issue;
    }

    async delete(issueId:string):Promise<Issue> {
        const issue = await issueRepository.deleteById(issueId);
        if(!issue) throw new Error("Issue not deleted");
        return issue;
    }
}
import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { IssueService } from "../service/issue";

const issueService = new IssueService()
export class IssueController{
    async create(req: Request, res: Response): Promise<void> {
        try{
            const { title,bookNumber,pageNumber,volume,chapter,tags,issue,createdBy } = req.body;
            const createdIssue = await issueService.create(title,bookNumber,pageNumber,volume,chapter,tags,issue,createdBy);
            res.status(201).json({ message: "Issue created successfully", createdIssue });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getAllIssues(req: Request, res: Response): Promise<void> {
        try{
            const books = await issueService.getAllIssues();
            res.status(200).json({ message: "Issues fetched successfully", books });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async getIssueById(req: Request, res: Response): Promise<void> {
        try{
            const issueId = req.params.issueId;
            const issue = await issueService.getIssueById(issueId);
            res.status(200).json({ message: "Issue fetched successfully", issue });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }
    

    async update(req: Request, res: Response): Promise<void> {
        try{
            const issueId =  req.params.issueId;
            const { title,bookNumber,pageNumber,volume,chapter,tags,issue,createdBy } = req.body;
            const updatedIssue = await issueService.update(issueId,title,bookNumber,pageNumber,volume,chapter,tags,issue,createdBy);
            res.status(200).json({ message: "Issue updated successfully", updatedIssue });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try{
            const issueId = req.params.issueId;
            const issue = await issueService.delete(issueId);
            res.status(200).json({ message: "Issue deleted successfully", issue });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async countIssues(req: Request, res: Response): Promise<void> {
        try{
            const count = await issueService.countIssues();
            res.status(200).json({ message: "Issues count fetched successfully", count });
        }catch(error){
            console.log(error);
            const statusCode = error instanceof AppError ? error.statusCode : 500;
            const message = error instanceof AppError ? error.message : "An unexpected error occurred";
            res.status(statusCode).json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
        }
    }

    async annotateIssue(req: Request, res: Response): Promise<void> {
        const { issueId } = req.body;
    
        try {
 
          const issue = await issueService.getIssueById(issueId);

          console.log("Issue:", issue);
    
          const projectRes = await fetch("https://studio.pathok.com.bd/api/projects", {
            method: "POST",
            headers: {
              "Authorization": "Token 685298f62992e1d89d8283b273247c6f9d7e7a0a",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              title: issue.title,
              description: "Project created from app",
              label_config: `
                <View>
                  <Text name="text" value="$text"/>
                  <Choices name="label" toName="text" choice="single">
                    <Choice value="Important"/>
                    <Choice value="Not Important"/>
                  </Choices>
                </View>
              `
            })
          });
    
          console.log("Project creation response status:", projectRes.status);
          const projectJson = await projectRes.json();
          console.log("Project JSON response:", projectJson);
    
          if (!projectJson.id) {
            res.status(500).json({ error: "Failed to create project" });
            return;
          }
    
          const importRes = await fetch(`https://studio.pathok.com.bd/api/projects/${projectJson.id}/import`, {
            method: "POST",
            headers: {
              "Authorization": "Token 685298f62992e1d89d8283b273247c6f9d7e7a0a",
              "Content-Type": "application/json",
            },
            body: JSON.stringify([
              {
                data: {
                  text: issue.issue
                }
              }
            ]),
          });                
          
          console.log("Import response:", importRes);
    
          console.log("Import response status:", importRes.status);
          if (!importRes.ok) {
            res.status(500).json({ error: "Failed to import data to project" });
            return;
          }
          res.status(200).json({ projectId: projectJson.id });
    
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Something went wrong" });
        }
      }

    getCSRFToken(req: Request, res: Response): void {
        res.setHeader('X-CSRFToken', (req as any).csrfToken());
        res.status(200).send();
    }

    
}
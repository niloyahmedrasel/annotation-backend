import express, { Request, Response, Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { ShamelaScrapperRepository } from '../repository/shamelaScrapper';
const router: Router = express.Router();

const shamelaScrapperRepository = new ShamelaScrapperRepository()


router.post('/scrape', async (req: Request, res: Response): Promise<any> => {
    try {
        const { baseUrl, bookNumber, startPage, endPage } = req.body;

        console.log("Received request to scrape:", baseUrl, bookNumber, startPage, endPage);

        if (!baseUrl || !bookNumber || !startPage || !endPage) {
            return res.status(400).json({ error: "Missing required fields: baseUrl, bookNumber, startPage, endPage" });
        }

        const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
        const scriptPath = path.join(__dirname, '../scripts/scraper.py');
        const pythonProcess = spawn(pythonExecutable, [scriptPath, baseUrl, bookNumber, startPage, endPage]);

        let data = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on('data', (error) => {
            errorData += error.toString();
            console.error(`Python Error: ${error.toString()}`);
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error("Python script failed with code:", code);
                return res.status(500).json({ 
                    error: "Python script execution failed",
                    details: errorData || "Unknown error"
                });
            }

            try {
                console.log("Python script output:", data);
                const parsedData = JSON.parse(data);

                console.log("Parsed data:", parsedData);
                
                if (parsedData.error) {
                    return res.status(404).json({ error: parsedData.error });
                }

                const combinedFilePath = parsedData.output_doc; // Path of generated doc file

                // Save file info to the database
                const newScraperDoc = await shamelaScrapperRepository.create({
                    title: path.basename(combinedFilePath),
                    fileType: path.extname(combinedFilePath),
                    createdAt: new Date(),
                    author: parsedData.author
                });

                await newScraperDoc.save();

                // ✅ Upload the file to LKP API
                console.log("Uploading generated .doc file to LKP API...");

                // Read file as a Buffer and create a Blob
                const fileBuffer = fs.readFileSync(combinedFilePath);
                const blob = new Blob([fileBuffer], { type: 'application/msword' }); // Adjust contentType as needed

                // Prepare FormData
                const formData = new FormData();
                formData.append('file', blob, path.basename(combinedFilePath));

                const response = await fetch("https://test.pathok.com.bd/upload", {
                    method: 'POST',
                    body: formData,
                });

                console.log("LKP API Response Status:", response.status);

                if (!response.ok) {
                    const errorResponse = await response.text();
                    console.error("LKP API Error:", errorResponse);
                    throw new Error(`Failed to upload file: ${response.statusText}`);
                }

                const responseData = await response.json();
                console.log("File uploaded successfully:", responseData);

                res.json({
                    ...parsedData,
                    savedDocumentId: newScraperDoc._id,
                    uploadedFileResponse: responseData,
                });

            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                res.status(500).json({ 
                    error: "Invalid JSON response from Python script",
                    details: data
                });
            }
        });

    } catch (error: any) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


router.get('/scraped-documents', async (req: Request, res: Response): Promise<any> => {
    try {
        const documents = await shamelaScrapperRepository.find({});
        res.json(documents);
    } catch (error: any) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

router.get('/scraped-documents/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const documentId = req.params.id;
        const document = await shamelaScrapperRepository.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(document);
    } catch (error: any) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

export default router;
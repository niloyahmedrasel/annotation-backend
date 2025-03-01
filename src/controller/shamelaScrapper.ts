import express, { Request, Response, Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { ShamelaScrapperRepository } from '../repository/shamelaScrapper';

const shamelaScrapperRepository = new ShamelaScrapperRepository();
const router: Router = express.Router();

router.post('/scrape', async (req: Request, res: Response): Promise<any> => {
    try {
        const { url } = req.body;
        console.log("URL:", url);

        if (!url) {
            return res.status(400).json({ error: "No URL provided" });
        }

        // Pass the URL to the Python script dynamically
        const pythonProcess = spawn('python3', [path.join(__dirname, '../scripts/scraper.py'), url]);

        let data = '';

        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        pythonProcess.stderr.on('data', (error) => {
            console.error(`Python Error: ${error.toString()}`);
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "Python script execution failed" });
            }

            try {
                console.log("Python script output:", data);

                // Parse the output from the Python script
                const parsedData = JSON.parse(data);
                
                // Handle errors if they occur in the Python script
                if (parsedData.error) {
                    return res.status(404).json({ error: parsedData.error });
                }

                res.json(parsedData);  // Return the scraped data as response
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                res.status(500).json({ error: "Invalid JSON response from Python script" });
            }
        });

    } catch (error: any) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

export default router;
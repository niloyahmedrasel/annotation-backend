import express, { Request, Response, Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router: Router = express.Router();

router.post('/scrape', async (req: Request, res: Response): Promise<any> => {
    try {
        const { baseUrl, bookNumber, startPage, endPage } = req.body;

        // Validate inputs
        if (!baseUrl || !bookNumber || !startPage || !endPage) {
            return res.status(400).json({ error: "Missing required fields: baseUrl, bookNumber, startPage, endPage" });
        }

        // Determine the Python executable (python3 or python)
        const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';

        // Path to the Python script
        const scriptPath = path.join(__dirname, '../scripts/scraper.py');

        // Spawn the Python process with dynamic inputs
        const pythonProcess = spawn(pythonExecutable, [scriptPath, baseUrl, bookNumber, startPage, endPage]);

        let data = '';
        let errorData = '';

        // Collect data from stdout
        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        // Collect errors from stderr
        pythonProcess.stderr.on('data', (error) => {
            errorData += error.toString();
            console.error(`Python Error: ${error.toString()}`);
        });

        // Handle process close event
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

                // Parse the output from the Python script
                const parsedData = JSON.parse(data);
                
                // Handle errors if they occur in the Python script
                if (parsedData.error) {
                    return res.status(404).json({ error: parsedData.error });
                }

                // Return the scraped data as response
                res.json(parsedData);
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                res.status(500).json({ 
                    error: "Invalid JSON response from Python script",
                    details: data  // Include the raw output for debugging
                });
            }
        });

    } catch (error: any) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

export default router;
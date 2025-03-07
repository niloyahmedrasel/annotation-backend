import { Request, Response } from "express";
import { BookRepository } from "../repository/book";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const bookRepository = new BookRepository();

// Function to retrieve the JWT secret from ONLYOFFICE configuration
function getJwtSecret(): string {
    try {
        // Path to the local.json file
        const localJsonPath = "/etc/onlyoffice/documentserver/local.json";

        // Read the file
        const localJson = fs.readFileSync(localJsonPath, "utf8");

        // Parse the JSON
        const config = JSON.parse(localJson);

        // Retrieve the JWT secret
        const jwtSecret = config.services.CoAuthoring.secret.session.string;

        if (!jwtSecret) {
            throw new Error("JWT secret not found in local.json");
        }

        return jwtSecret;
    } catch (error) {
        console.error("Error retrieving JWT secret:", error);
        throw error;
    }
}

export class DocEditorController {
    async openDocEditor(req: Request, res: Response): Promise<any> {
        try {
            const { bookId } = req.params;
            console.log("Book ID:", bookId);

            const book = await bookRepository.findById(bookId);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            const fileName = book.bookFile;
            if (!fileName) {
                return res.status(400).json({ error: 'No document file available' });
            }

            console.log("File Name:", fileName);

            const fileUrl = `https://lkp.pathok.com.bd/upload/${fileName}`;
            const onlyOfficeServer = 'https://office.pathok.com.bd';
            const callbackUrl = 'https://lkp.pathok.com.bd/callback'; // Replace with your callback URL

            // Retrieve the JWT secret dynamically
            const JWT_SECRET = getJwtSecret();

            // Generate JWT token
            const payload = {
                document: {
                    fileType: "docx", // Change based on the file type
                    key: bookId, // Unique document key
                    title: fileName,
                    permissions: {
                        edit: true,
                        download: true,
                    },
                },
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

            // Construct the editor URL (without the token in the query string)
            const editorUrl = `${onlyOfficeServer}/edit?file=${encodeURIComponent(fileUrl)}&callbackUrl=${encodeURIComponent(callbackUrl)}`;

            // Return the editor URL and the JWT token
            res.json({ editorUrl, token });
        } catch (error) {
            console.error("Error fetching book or generating editor URL:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

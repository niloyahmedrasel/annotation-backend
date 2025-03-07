import { Request, Response } from "express";
import { BookRepository } from "../repository/book";
import jwt from "jsonwebtoken";

const bookRepository = new BookRepository();

// Replace with your JWT secret (retrieved from ONLYOFFICE)
const JWT_SECRET = "InUsmC7X9Semktj2S2BBBluVBgwzVPvm";

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

            // Construct the editor URL (without callbackUrl)
            const editorUrl = `${onlyOfficeServer}/edit?file=${encodeURIComponent(fileUrl)}`;

            // Return the editor URL and the JWT token
            res.json({ editorUrl, token });
        } catch (error) {
            console.error("Error fetching book or generating editor URL:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

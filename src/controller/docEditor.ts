import { Request, Response } from "express";
import { BookRepository } from "../repository/book";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const bookRepository = new BookRepository();


const ONLY_OFFICE_JWT_SECRET = process.env.ONLY_OFFICE_JWT_SECRET || '';

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
            const payload = {
                document: {
                    fileType: "docx", 
                    key: bookId, 
                    title: fileName,
                    permissions: {
                        edit: true,
                        download: true,
                    },
                },
            };

            const token = jwt.sign(payload,ONLY_OFFICE_JWT_SECRET, { expiresIn: "24h" });
            const editorUrl = `${onlyOfficeServer}/edit?file=${encodeURIComponent(fileUrl)}`;

            fetch(editorUrl, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })

            res.json({ editorUrl, token });
        } catch (error) {
            console.error("Error fetching book or generating editor URL:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

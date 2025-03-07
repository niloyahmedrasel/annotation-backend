import { Request, Response } from "express";
import { BookRepository } from "../repository/book";

const bookRepository = new BookRepository();

export class DocEditorController {
    async openDocEditor(req: Request, res: Response): Promise<any> {
        try {
            const { bookId } = req.params;

            const book = await bookRepository.findById(bookId);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }

            const fileName = book.bookFile;
            if (!fileName) {
                return res.status(400).json({ error: 'No document file available' });
            }

            const fileUrl = `https://lkp.pathok.com.bd/upload/${fileName}`;

            const onlyOfficeServer = 'https://office.pathok.com.bd';

            const editorUrl = `${onlyOfficeServer}/edit?file=${encodeURIComponent(fileUrl)}`;

            res.json({ editorUrl });
        } catch (error) {
            console.error("Error fetching book or generating editor URL:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

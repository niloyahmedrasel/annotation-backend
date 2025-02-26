import { Request, Response } from "express";
import { BookRepository } from "../repository/book";

const bookRepository = new BookRepository();
export class DocEditorController {
    async openDocEditor(req: Request, res: Response): Promise<any> {
        try {
            const { bookId } = req.params;
            
            // Fetch the book document from your database using the bookId
            const book = await bookRepository.findById(bookId); // Assuming BookModel is your Mongoose model
            if (!book) {
              return res.status(404).json({ error: 'Book not found' });
            }
        
            // Ensure that the book contains a valid bookfile URL (assuming it's stored in 'bookfile')
            const fileUrl = book.bookFile;
            if (!fileUrl) {
              return res.status(400).json({ error: 'No document file available' });
            }
        
            // The OnlyOffice Document Server URL (Replace with your actual OnlyOffice server)
            const onlyOfficeServer = 'https://documentserver.onlyoffice.com';
        
            // Generate the OnlyOffice editor URL
            const editorUrl = `${onlyOfficeServer}/edit?file=${encodeURIComponent(fileUrl)}`;
        
            // Return the editor URL to the frontend
            res.json({ editorUrl });
          } catch (error) {
            console.error("Error fetching book or generating editor URL:", error);
            res.status(500).json({ error: 'Internal server error' });
          }
    }
}
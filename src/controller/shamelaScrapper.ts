import { Request, Response } from 'express';
import { ShamelaScrapperRepository } from '../repository/shamelaScrapper';

// Use dynamic import for Shamela
const shamelaScrapperRepository = new ShamelaScrapperRepository();

export class ShamelaScrapperController {
  async scrapeBook(req: Request, res: Response): Promise<any> {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    try {
      // Dynamically import Shamela package
      const { downloadBook } = await import('shamela'); // Dynamically importing

      // Step 1: Extract book ID from URL (if Shamela requires it)
      const bookId = this.extractBookIdFromUrl(url);
      if (!bookId) {
        throw new Error('Invalid book URL');
      }

      // Convert bookId to number
      const bookIdNumber = parseInt(bookId, 10);
      if (isNaN(bookIdNumber)) {
        throw new Error('Invalid book ID');
      }

      // Step 2: Define options (required by Shamela)
      const options: any = {
        outputFile: {
          path: './downloaded-books/book_' + bookIdNumber + '.txt', // Correct path format based on OutputOptions
        },
      };

      // Step 3: Fetch the book data using the downloadBook function (from Shamela)
      const bookData = await downloadBook(bookIdNumber, options);

      // Parse the bookData response to extract title and content
      if (!bookData) {
        throw new Error('Failed to extract data from Shamela');
      }

      // Assuming bookData is a string, you might need to parse or process it
      const title = bookData.split("\n")[0];  // Example: take the first line as title
      const content = bookData;  // Example: use full content

      // Step 4: Save the scraped data to MongoDB
      const newScrapedData = await shamelaScrapperRepository.create({
        title,
        content,
      });

      // Step 5: Send response to the client
      res.status(200).json({
        message: 'Data scraped and saved successfully',
        data: { title, content },
      });
    } catch (error) {
      console.error('Error during scraping:', error);
      res.status(500).json({ message: 'Failed to scrape data', error: error });
    }
  }

  // Helper function to extract book ID from the URL
  private extractBookIdFromUrl(url: string): string | null {
    const regex = /\/book\/(\d+)/;  // Adjust regex to match Shamela's URL pattern
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}

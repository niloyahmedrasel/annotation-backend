import { Request, Response } from "express";
import { BookRepository } from "../repository/book";
import path from "path";
import fs from "fs";

const bookRepository = new BookRepository();

export class HostingDiscoveryController {
  
  // ✅ WOPI Discovery Endpoint
  async discoveryXML(req: Request, res: Response): Promise<any> {
    const fileId = req.query.fileid?.toString();

    if (!fileId) {
      return res.status(400).send('fileid query parameter is required');
    }

    // Fetch document details
    const document = await bookRepository.findOne({ _id: fileId });

    if (!document) {
      return res.status(404).send('Document not found');
    }

    // ✅ OnlyOffice Discovery XML Response
    res.set('Content-Type', 'application/xml');
    res.send(`
      <wopi-discovery>
        <app-name>OnlyOffice</app-name>
        <file-id>${fileId}</file-id>
        <edit-file-url>https://office.pathok.com.bd/hosting/wopi/word/edit?wopisrc=${encodeURIComponent(`https://lkp.pathok.com.bd/wopi/files/${fileId}`)}</edit-file-url>
        <view-file-url>https://office.pathok.com.bd/hosting/wopi/word/view?wopisrc=${encodeURIComponent(`https://lkp.pathok.com.bd/wopi/files/${fileId}`)}</view-file-url>
      </wopi-discovery>
    `);
  }

  // ✅ Redirect to OnlyOffice Editor
  async editFile(req: Request, res: Response): Promise<any> {
    const fileId = req.query.fileid?.toString();

    if (!fileId) {
      return res.status(400).send('fileid query parameter is required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      if (!document) {
        return res.status(404).send('Document not found');
      }

      // ✅ OnlyOffice Editor URL
      const onlyOfficeEditorUrl = `https://office.pathok.com.bd/hosting/wopi/word/edit?wopisrc=${encodeURIComponent(`https://lkp.pathok.com.bd/wopi/files/${fileId}`)}`;

      // Redirect to OnlyOffice Editor
      res.redirect(onlyOfficeEditorUrl);
    } catch (error) {
      return res.status(500).send('Error retrieving document for editing');
    }
  }

  // ✅ Redirect to OnlyOffice Viewer
  async viewFile(req: Request, res: Response): Promise<any> {
    const fileId = req.query.fileid?.toString();

    if (!fileId) {
      return res.status(400).send('fileid query parameter is required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      if (!document) {
        return res.status(404).send('Document not found');
      }

      // ✅ OnlyOffice Viewer URL
      const onlyOfficeViewerUrl = `https://office.pathok.com.bd/hosting/wopi/word/view?wopisrc=${encodeURIComponent(`https://lkp.pathok.com.bd/wopi/files/${fileId}`)}`;

      // Redirect to OnlyOffice Viewer
      res.redirect(onlyOfficeViewerUrl);
    } catch (error) {
      return res.status(500).send('Error retrieving document for viewing');
    }
  }

  // ✅ WOPI File Info API (Needed for OnlyOffice)
  async checkFileInfo(req: Request, res: Response): Promise<any> {
    const fileId = req.params.fileId;

    if (!fileId) {
      return res.status(400).send('fileId parameter is required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      if (!document) {
        return res.status(404).send('Document not found');
      }

      const filePath = path.join(__dirname, 'public', 'upload', document.bookFile);
      const stats = fs.statSync(filePath);

      res.json({
        BaseFileName: document.bookFile,
        Size: stats.size,
        Version: stats.mtimeMs.toString(),
        SupportsLocks: true,
        SupportsUpdate: true,
        SupportsRename: false,
        UserCanWrite: true
      });
    } catch (error) {
      return res.status(500).send('Error retrieving file info');
    }
  }

  // ✅ WOPI File Download API
  async getFile(req: Request, res: Response): Promise<any> {
    const fileId = req.params.fileId;

    if (!fileId) {
      return res.status(400).send('fileId parameter is required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      if (!document) {
        return res.status(404).send('Document not found');
      }

      const filePath = path.join(__dirname, 'public', 'upload', document.bookFile);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
      }

      res.download(filePath, document.bookFile);
    } catch (error) {
      return res.status(500).send('Error downloading file');
    }
  }
}

import { Request, Response } from "express";
import { BookRepository } from "../repository/book";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

const bookRepository = new BookRepository();

export class HostingDiscoveryController {
  
  // ✅ WOPI Discovery Endpoint
  async discoveryXML(req: Request, res: Response): Promise<any> {
    const fileId = req.query.fileId; // Assuming you get fileId from the query params (or somewhere else in the request)
    
    // If fileId is missing, return an error (optional)
    if (!fileId) {
      return res.status(400).send('Missing fileId');
    }
  
    const fileUrl = `https://lkp.pathok.com.bd/wopi/files/${fileId}`;
    
    // Set the Content-Type header for XML
    res.set('Content-Type', 'application/xml');
    
    // Send the discovery XML with the proper interpolated URL
    res.send(`
      <?xml version="1.0" encoding="UTF-8"?>
      <wopi-discovery>
        <net-zone name="public">
          <app name="Word">
            <action name="view"
                    ext="docx"
                    urlsrc="https://office.pathok.com.bd/office/editor?wopisrc=${encodeURIComponent(fileUrl)}"/>
            <action name="edit"
                    ext="docx"
                    urlsrc="https://office.pathok.com.bd/office/editor?wopisrc=${encodeURIComponent(fileUrl)}"/>
          </app>
        </net-zone>
      </wopi-discovery>
    `);
  }
  

  // ✅ Redirect to OnlyOffice Editor
  async editFile(req: Request, res: Response): Promise<any> {
    const fileId = req.query.fileid?.toString();
    const accessToken = req.query.access_token?.toString();

    if (!fileId || !accessToken) {
      return res.status(400).send('fileid and access_token query parameters are required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      if (!document) {
        return res.status(404).send('Document not found');
      }

      // ✅ OnlyOffice Editor URL
      const onlyOfficeEditorUrl = `https://office.pathok.com.bd/office/editor?wopisrc=${encodeURIComponent(`https://lkp.pathok.com.bd/wopi/files/${fileId}`)}&access_token=${accessToken}`;

      // Redirect to OnlyOffice Editor
      res.redirect(onlyOfficeEditorUrl);
    } catch (error) {
      return res.status(500).send('Error retrieving document for editing');
    }
  }

  // ✅ Redirect to OnlyOffice Viewer
  async viewFile(req: Request, res: Response): Promise<any> {
    const fileId = req.query.fileid?.toString();
    const accessToken = req.query.access_token?.toString();

    if (!fileId || !accessToken) {
      return res.status(400).send('fileid and access_token query parameters are required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      if (!document) {
        return res.status(404).send('Document not found');
      }

      // ✅ OnlyOffice Viewer URL
      const onlyOfficeViewerUrl = `https://office.pathok.com.bd/office/editor?wopisrc=${encodeURIComponent(`https://lkp.pathok.com.bd/wopi/files/${fileId}`)}&access_token=${accessToken}`;

      // Redirect to OnlyOffice Viewer
      res.redirect(onlyOfficeViewerUrl);
    } catch (error) {
      return res.status(500).send('Error retrieving document for viewing');
    }
  }

  // ✅ WOPI File Info API (Needed for OnlyOffice)
  async checkFileInfo(req: Request, res: Response): Promise<any> {
    const fileId = req.params.fileId;
    const accessToken = req.query.access_token?.toString();

    if (!fileId || !accessToken) {
      return res.status(400).send('fileId and access_token parameters are required');
    }

    try {
      const document = await bookRepository.findOne({ _id: fileId });

      console.log("this is document",document)
      if (!document) {
        return res.status(404).send('Document not found');
      }

      const filePath = path.join(__dirname, 'public', 'upload', document.bookFile);
      console.log("this is file path",filePath)
      const stats = fs.statSync(filePath);

      console.log("this is stats",stats)
      res.json({
        BaseFileName: document.bookFile,
        OwnerId: "", // Add ownerId to your document model
        UserId: "", // Assuming you have user information in the request
        UserFriendlyName: "", // Assuming you have user information in the request
        Size: stats.size,
        Version: stats.mtimeMs.toString(),
        SupportsLocks: true,
        SupportsUpdate: true,
        SupportsRename: false,
        UserCanWrite: true,
        PostMessageOrigin: "https://office.pathok.com.bd"
      });
    } catch (error) {
      return res.status(500).send('Error retrieving file info');
    }
  }

  // ✅ WOPI File Download API
  async getFile(req: Request, res: Response): Promise<any> {
    const fileId = req.params.fileId;
    const accessToken = req.query.access_token?.toString();

    if (!fileId || !accessToken) {
      return res.status(400).send('fileId and access_token parameters are required');
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

      res.setHeader('Content-Type', 'application/octet-stream');
      res.sendFile(filePath);
    } catch (error) {
      return res.status(500).send('Error downloading file');
    }
  }
}
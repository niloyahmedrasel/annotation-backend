import express from "express";
import { HostingDiscoveryController } from "../controller/hostingDiscovery";

const router = express.Router();
const hostingDiscoveryController = new HostingDiscoveryController();

// ✅ WOPI Discovery
router.get("/wopi/discovery", hostingDiscoveryController.discoveryXML);

// ✅ Edit Document in OnlyOffice
router.get("/wopi/edit", hostingDiscoveryController.editFile);

// ✅ View Document in OnlyOffice
router.get("/wopi/view", hostingDiscoveryController.viewFile);

// ✅ WOPI File Metadata API
router.get("/wopi/files/:fileId", hostingDiscoveryController.checkFileInfo);

// ✅ WOPI File Download API
router.get("/wopi/get/files/:fileId", hostingDiscoveryController.getFile);

export default router;

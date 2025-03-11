import express from "express";
import { spawn } from 'child_process';

import cors from "cors";
import connectDB from "./config/db";
import userRouter from "./router/user";
import bookRouter from "./router/book";
import bookTypeRouter from "./router/bookType";
import issueRouter from "./router/issue";
import permissionRouter from "./router/permission";
import docEditorRouter from "./router/docEditor";
import scrapRouter from "./controller/shamelaScrapper"
import wopiRoutes from "./router/hostingDiscovery"
import path from "path";
import bodyParser from "body-parser";
import { seed } from "./seeder";
import { HostingDiscoveryController } from "./controller/hostingDiscovery";
const hostingDiscoveryController = new HostingDiscoveryController();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.options("*", cors()); 
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
connectDB();
seed();
app.use("/output", express.static(path.join(__dirname, "../combined_output")));
app.use("/upload", express.static(path.join(__dirname, "../public/upload")));

  

console.log(path.join(__dirname, "../combined_output"));

app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/bookType", bookTypeRouter);
app.use("/api/issue", issueRouter);
app.use("/api/permission", permissionRouter);
app.use("/api/docEditor", docEditorRouter);
app.use("/api", scrapRouter);
app.use("/", wopiRoutes);

app.get("/", (req, res) => {
    res.send("hello world!")
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

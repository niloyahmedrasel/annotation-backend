import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import userRouter from "./router/user";
import bookRouter from "./router/book";
import bookTypeRouter from "./router/bookType";
import issueRouter from "./router/issue";
import permissionRouter from "./router/permission";
import docEditorRouter from "./router/docEditor";
import shamelaScrapperRouter from "./router/shamelaScrapper";
import path from "path";
import bodyParser from "body-parser";


const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); 
app.options("*", cors()); 
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
connectDB();
app.use("/upload", express.static(path.join(__dirname, "../public/upload")));

app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/bookType", bookTypeRouter);
app.use("/api/issue", issueRouter);
app.use("/api/permission", permissionRouter);
app.use("/api/docEditor", docEditorRouter);
app.use("/api/shamelaScrapper", shamelaScrapperRouter);

app.get("/", (req, res) => {
    res.send("hello world!")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

import express from "express";
import cors from "cors";
import xlsx from "xlsx"
import multer from "multer";
import pdf from "html-pdf"
import path from "path";
import { URL } from "url";
import pdfTemplate from "./documents/index1.js";
// const pdfTemplate=require("./documents/index1")
// const exceltojson=require("convert-excel-to-json");
import excelToJson from "convert-excel-to-json";
// const fs=require("fs-extra");
import fs from "fs-extra"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv"; 
dotenv.config(); 

const app = express();

import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const corsOrigin = {
    origin: 'http://localhost:3000', //or whatever port your frontend is using
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin));

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const accessSecret = process.env.ACCESS_SECRET;
const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIARZX5NBNC4YGXGLV3", 
        secretAccessKey: "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",
    }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("server");
});

app.post("/api/posts", upload.single("image"), async (req, res) => {
    try {
        console.log("req.body", req.body);
        console.log("connected with react");
        console.log("req.file", req.file);

        const params = {
            Bucket: "busatech-farman",
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        res.status(200).json({
            message: "Image uploaded successfully",
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "An error occurred while uploading the image",
        });
    }
});






//for excel code-----

app.post('/api/excel', upload.single('excelFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("no file uploaded")
        } else {
            const fileBuffer = req.file.buffer;
            const workbook = xlsx.read(fileBuffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            
              res.json(jsonData)
        }
    } catch (error) {
        res.status(500).json({
            error: "error not upload excel"
        })
    }

});


//pdf generate-----
app.post("/create-pdf",(req,res)=>{
    pdf.create(pdfTemplate(req.body),{}).toFile("result.pdf",(err)=>{
        if(err){
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    });
});



// Define a GET route to download the generated PDF
app.get("/fetch-pdf", (req, res) => {
    // Set the appropriate headers for PDF file download
    res.setHeader("Content-Disposition", "attachment; filename=result.pdf");
    res.setHeader("Content-Type", "application/pdf");
    
    // Send the generated PDF file to the client
    const fileStream = fs.createReadStream("result.pdf");
    fileStream.pipe(res);
});

app.listen(5000, () => console.log("Listening on port 5000")); 

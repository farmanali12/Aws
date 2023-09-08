// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const app = express();
// const port = 4000;

// // Create a storage engine for multer
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// Define a route for uploading Excel files
// app.post('/excel', upload.single('excelFile'), (req, res) => {
//   try {
//     // Read the uploaded Excel file from memory
//     const workbook = xlsx.read(req.file.buffer);

//     // Assuming that you want to convert the first sheet of the Excel file to JSON
//     const sheetName = workbook.SheetNames[0]; 
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     res.json({ data: jsonData });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while processing the Excel file.' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

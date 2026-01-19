const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const router = express.Router();
const UserDB = require('../DB/entities/potential_users.entity');
const projectsDB = require('../DB/entities/project.entity');

const upload = multer({ dest: 'uploads/' });

router.post('/potential_users', upload.single('file'), (req, res) => {
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push({ ID: data.ID }))
        .on('end', () => {
            UserDB.insertMany(results, { ordered: false })
                .then(dbRes => res.status(201).json(dbRes))
                .catch(err => {
                    if (err.code === 11000) {
                        // Duplicate key error
                        res.status(400).json({ error: 'Duplicate IDs found in the file' });
                    } else {
                        res.status(400).json({ error: err.message });
                    }
                });
        });
});

function removeNonUTF8(str) {
    // Convert the string to a buffer, specifying the 'utf8' encoding
    const buffer = Buffer.from(str, 'utf8');

    // Convert the buffer back to a string, using 'utf8'
    // This will drop any characters that cannot be represented in UTF-8
    const cleanedStr = buffer.toString('utf8');

    return cleanedStr;
}

function cleanTitle(title) {
    return title.replace(/^\uFEFF/, ''); // Remove BOM if present
}


router.post('/projects', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    const failedInserts = []; // List to keep track of failed WorkshopNames
    const filePath = req.file.path;

    fs.createReadStream(filePath, { encoding: 'utf8' })
    .pipe(csv())
    .on('data', (data) => {
        
        // Clean each field in the data object
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                const originalValue = data[key];
                data[key] = removeNonUTF8(data[key]);
                // Data cleaned silently
            }
        }
        if (data['Title']) {
            data['Title'] = cleanTitle(data['Title']);
        }

        results.push(data);
    })
    .on('error', (error) => {
        console.error('Error while reading the CSV file:', error); // Log any errors during reading
        fs.unlinkSync(filePath); // Clean up the temp file
        res.status(500).json({ error: 'Error while parsing CSV' });
    })
    .on('end', async () => {
        for (let i = 0; i < results.length; i++) {
            const record = results[i];
            try {
                await projectsDB.create(record); // Insert the entire record
            } catch (err) {
                console.error(`Failed to insert record with WorkshopName: ${record.WorkshopName}`, err.message);
                failedInserts.push(record.WorkshopName);
            }
        }

        fs.unlinkSync(filePath); // Clean up the temp file
        res.status(201).json({ message: 'Processing completed', failedInserts });
    })
    .on('error', (error) => {
        console.error('Error during CSV reading:', error);
        fs.unlinkSync(filePath); // Clean up the temp file
        res.status(500).json({ error: 'Error during CSV processing' });
    });
});

module.exports = router;
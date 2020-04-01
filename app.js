const express = require("express");
require("dotenv").config();
const port = process.env.PORT;
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const helpers = require("./helpers");
const generateFile = require("./generate.js");
const fs = require("fs");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    }
});

const app = express();

app.use(express.static("view"));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logic

app.post("/action", (req, res) => {
    let upload = multer({
        storage: storage,
        fileFilter: helpers.imageFilter
    }).single("output");
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send("Please select an image to upload");
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        req.body.output = req.file.path;
        res.download(generateFile.someFunc(req, res));
        const directoriesToBeCleared = ["uploads", "generated"];
        for (const directory of directoriesToBeCleared) {
            fs.readdir(directory, (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                    });
                }
            });
        }
    });
});

// Server Configuration

var server = app.listen(port, () => {
    console.log(`Listening At ${port} ...`);
});

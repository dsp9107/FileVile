// FILL A WORD TEMPLATE WITH USER PROVIDED DATA
var ImageModule = require("open-docxtemplater-image-module");
var JSZip = require("jszip");
var sizeOf = require("image-size");
var Docxtemplater = require("docxtemplater");
const fs = require("fs");

const inputFile = "templates\\templatePracticalPython.docx";
const outputFile = "generated\\generatedPracticalPython.docx";

exports.someFunc = (req, res) => {
    const userData = {
        HANDLE: req.body.handle,
        UID: req.body.uid,
        NAME: req.body.name,
        AIM: req.body.aim,
        CODE: [{ line: req.body.code }],
        OUTPUT: req.body.output
    };
    const content = fs.readFileSync(inputFile);

    //Below the options that will be passed to ImageModule instance
    var opts = {};
    opts.centered = false; //Set to true to always center images
    opts.fileType = "docx"; //Or pptx

    //Pass your image loader
    opts.getImage = function(tagValue, tagName) {
        //tagValue is 'examples/image.png'
        //tagName is 'image'
        return fs.readFileSync(tagValue);
    };

    //Pass the function that return image size
    // opts.getSize = function(img, tagValue, tagName) {
    //     //img is the image returned by opts.getImage()
    //     //tagValue is 'examples/image.png'
    //     //tagName is 'image'
    //     //tip: you can use node module 'image-size' here
    //     var dimensions = sizeOf(img);
    //     return [528, dimensions.height];
    // };

    opts.getSize = function(img, buffer, value, tagName, context) {
        sizeOf = require("image-size");
        var sizeObj = sizeOf(img);
        const maxWidth = 528;
        const ratio = sizeObj.width / sizeObj.height;
        let newWidth = Math.min(maxWidth, sizeObj.width);
        let newHeight = parseInt(newWidth / ratio, 10);
        return [newWidth, newHeight];
    };

    var imageModule = new ImageModule(opts);

    var zip = new JSZip(content);
    var doc = new Docxtemplater()
        .attachModule(imageModule)
        .loadZip(zip)
        .setData({
            UID: userData.UID,
            AIM: userData.AIM,
            hasCode: true,
            CODE: userData.CODE,
            OUTPUT: userData.OUTPUT,
            hasHandle: true,
            handle: "@" + userData.HANDLE
        })
        .render();
    var buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputFile, buffer);
    return outputFile;
};

// FILL A WORD TEMPLATE WITH USER PROVIDED DATA

//Node.js example
var ImageModule = require("open-docxtemplater-image-module");
var JSZip = require("jszip");
var Docxtemplater = require("docxtemplater");
const fs = require("fs");
const content = fs.readFileSync("example.docx");
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
opts.getSize = function(img, tagValue, tagName) {
    //img is the image returned by opts.getImage()
    //tagValue is 'examples/image.png'
    //tagName is 'image'
    //tip: you can use node module 'image-size' here
    return [150, 150];
};

var imageModule = new ImageModule(opts);

var zip = new JSZip(content);
var doc = new Docxtemplater()
    .attachModule(imageModule)
    .loadZip(zip)
    .setData({
        AIM: "WAP to calculate area of a circle",
        CODE: `import math\nr=2.5\narea=math.pi*(r**2)\nprint("Area :",area)`,
        image: "data/ScreenShot.png"
    })
    .render();

var buffer = doc.getZip().generate({ type: "nodebuffer" });

fs.writeFileSync("test.docx", buffer);

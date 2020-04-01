// GENERATE A TEMPLATE FOR PYTHON PRACTICAL FILE

const officegen = require("officegen");
const fs = require("fs");

// Create an empty Word object:
let docx = officegen("docx");

// Officegen calling this function after finishing to generate the docx document:
docx.on("finalize", function(written) {
    console.log("Finish to create a Microsoft Word document.");
});

// Officegen calling this function to report errors:
docx.on("error", function(err) {
    console.log(err);
});

// AIM

let pObj = docx.createP();

pObj.addText("Aim : ", {
    font_face: "Calibri",
    font_size: 16,
    bold: true
});
pObj.addText("{AIM}", { font_face: "Calibri", font_size: 13 });

// CODE

pObj = docx.createP();

pObj.addText("Code : ", {
    font_face: "Calibri",
    font_size: 16,
    bold: true
});
pObj.addLineBreak();
pObj.addText("{CODE}", { font_face: "Courier New", font_size: 11 });

// OUTPUT

pObj = docx.createP();

pObj.addText("Output : ", {
    font_face: "Calibri",
    font_size: 16,
    bold: true
});
pObj.addLineBreak();
pObj.addText("{OUTPUT}");

// We can even add images:
// pObj.addImage("WebDevs-Logo.png");

// Let's generate the Word document into a file:

let out = fs.createWriteStream("example.docx");

out.on("error", function(err) {
    console.log(err);
});

// Async call to generate the output file:
docx.generate(out);

// GENERATE A TEMPLATE FOR PYTHON PRACTICAL FILE

const outputFile = "templates\\templatePracticalPython.docx";

const officegen = require("officegen");
const fs = require("fs");

// Create an empty Word object:
let docx = officegen("docx");

// Officegen calling this function after finishing to generate the docx document:
docx.on("finalize", function(written) {
    console.log(
        "Templat generated in .docx format. Can be found at " + outputFile
    );
});

// Officegen calling this function to report errors:
docx.on("error", function(err) {
    console.log(err);
});

// HEADER

var header = docx.getHeader().createP();
header.options.align = "right";
header.addText("{UID}");

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

pObj.addText("{#hasCode}", {
    font_face: "Calibri",
    font_size: 11
});
pObj.addText("Code : ", {
    font_face: "Calibri",
    font_size: 16,
    bold: true
});
pObj = docx.createP();
pObj.addText("{#CODE}", { font_face: "Courier New", font_size: 11 });
pObj.addText("{line}", { font_face: "Courier New", font_size: 11 });
pObj.addLineBreak();
pObj.addText("{/CODE}", { font_face: "Courier New", font_size: 11 });
pObj.addText("{/hasCode}", {
    font_face: "Calibri",
    font_size: 11
});
// OUTPUT

pObj = docx.createP();

pObj.addText("Output : ", {
    font_face: "Calibri",
    font_size: 16,
    bold: true
});
pObj.addLineBreak();
pObj.addText("{%OUTPUT}");

// FOOTER

var footer = docx.getFooter().createP();
footer.options.align = "right";
footer.addText("{#hasHandle}{handle}{/hasHandle}");

// We can even add images:
// pObj.addImage("WebDevs-Logo.png");

// Let's generate the Word document into a file:

let out = fs.createWriteStream(outputFile);

out.on("error", function(err) {
    console.log(err);
});

// Async call to generate the output file:
docx.generate(out);

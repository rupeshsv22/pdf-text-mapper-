const fs = require('fs');
const pdf = require('pdf-parse');
const { PDFDocument, rgb } = require('pdf-lib');
const crypto = require('crypto');
const path = require('path');

// Path to the original PDF file
const pdfPath = '';

// Function to generate a random file name
const generateRandomFileName = (prefix = 'pdf') => {
    const randomString = crypto.randomBytes(8).toString('hex'); 
    return `${prefix}_${randomString}.pdf`;
};

// Helper function to split text into lines with word and line spacing
const wrapText = (text, maxCharsPerLine, wordSpacing) => {
    const lines = [];
    for (let i = 0; i < text.length; i += maxCharsPerLine) {
        const line = text.slice(i, i + maxCharsPerLine);
        // Adjust word spacing by inserting additional spaces
        const spacedLine = line.split(' ').join(' '.repeat(wordSpacing));
        lines.push(spacedLine);
    }
    return lines;
};

// Function to add multiple texts at different coordinates
const addTextToPDF = async (inputPath, outputDir, textBlocks) => {
    try {
        // Load the existing PDF
        const existingPdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the first page (assuming single-page PDF)
        const page = pdfDoc.getPage(0);

        // Process each text block
        textBlocks.forEach(({ text, x, startY, maxCharsPerLine, wordSpacing, lineSpacing, fontSize }) => {
            // Split the text into lines
            const lines = wrapText(text, maxCharsPerLine, wordSpacing);

            // Draw each line with customized spacing
            lines.forEach((line, index) => {
                const y = startY - index * lineSpacing; // Adjust Y-position for each line
                page.drawText(line, {
                    x: x,
                    y: y,
                    size: fontSize,
                    color: rgb(1, 0, 0), // Red color
                });
            });
        });

        // Generate a random filename and save the PDF
        const randomFileName = generateRandomFileName('modified_pdf');
        const outputPath = path.join(outputDir, randomFileName);
        const pdfBytes = await pdfDoc.save();

        fs.writeFileSync(outputPath, pdfBytes);
        console.log(`✅ PDF saved at: ${outputPath}`);
    } catch (error) {
        console.error("Error adding text to PDF:", error);
    }
};

// Main function to add multiple text blocks to a PDF
const main = async () => {
    const outputDir = ''; // Output directory

    // Define multiple text blocks with different properties
    const textBlocks = [
        {
             //for name 
            text: " Demodemo Demo Demodemodemo", // Text to print
            x: 348,                    // X-coordinate
            startY: 675,               // Starting Y-coordinate
            maxCharsPerLine: 20,       // Maximum characters per line
            wordSpacing: 2,            // Space between words (in characters)
            lineSpacing: 16,           // Vertical space between lines (in points)
            fontSize: 15,              // Font size
        },
        // for address
        {
            text: "Demodemo Demo DemodemodemoDemodemo Demo DemodemodemoDemodemo Demo DemodemodemoDemodemo Demo Demodemodemo", // Another text block
            x: 335,                    // Different X-coordinate
            startY: 650,               // Different Y-coordinate
            maxCharsPerLine: 30,       // Maximum characters per line
            wordSpacing: 2,            // Space between words (in characters)
            lineSpacing: 10.50,           // Vertical space between lines (in points)
            fontSize: 10,              // Font size
        }
        //......
    ];

    // Add the multiple text blocks to the PDF
    await addTextToPDF(pdfPath, outputDir, textBlocks);
};

main();

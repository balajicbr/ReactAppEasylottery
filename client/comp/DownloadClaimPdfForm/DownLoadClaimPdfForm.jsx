import React ,{useRef}from 'react';
import { useSelector } from "react-redux"; 
import { jsPDF } from 'jspdf';
import { toast } from "react-toastify";
import './DownloadClaimPdfForm.css';
import axios from "axios";
const DownloadClaimPdfForm = ({schemeid}) => {
const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const userName = user?.user_name;
  const imageRef = useRef(null);

  // Helper function to set text styles
  const setTextStyles = (doc, color = [0, 0, 0], font = 'helvetica', size = 9, style = 'normal') => {
    doc.setTextColor(...color);
    doc.setFont(font, style);
    doc.setFontSize(size);
  };

  // Helper function: fetch image and convert to base64 data URL (async version)
  const toDataURL = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownloadTemplate = async () => {

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const watermarkWidth = 100;
    const watermarkHeight = 100;
    const watermarkX = (pageWidth - watermarkWidth) / 2; // Center horizontally
    const watermarkY = (pageHeight - watermarkHeight) / 2; // Center vertically
    const generateReferenceNumber = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      let suffix = '';

      for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      for (let j = 0; j < 4; j++) {
        suffix += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      return `${code}-${suffix}`;
    };
    const referenceNumber = generateReferenceNumber();

    try {
        if (!imageRef.current) {
          imageRef.current = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png');
        }
        const imgData = imageRef.current;

      // Add watermark image with low opacity
      doc.setGState(new doc.GState({ opacity: 0.2 }));
      doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
      // Reset opacity to fully opaque
      doc.setGState(new doc.GState({ opacity: 1 }));
        // Add "Reference No" on the top right corner before the border
        const referenceText = `Reference No: ${referenceNumber}`;
        setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'normal');
        const referenceTextWidth = doc.getTextWidth(referenceText);
        const referenceTextX = pageWidth - 10 - referenceTextWidth; // 10 is the same margin as the border
        const referenceTextY = 8; // A little above the border

        doc.text(referenceText, referenceTextX, referenceTextY);
      // Draw black border around the page
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      // Layout for image and text side by side
      const leftMargin = 15;
      const rightMargin = 25.5;
      const contentWidth = pageWidth - leftMargin - rightMargin;

      const imageWidth = 25;
      const imageHeight = 25;
      const gap = 5; // Gap between image and text

      const textContainerWidth = contentWidth - imageWidth - gap;

      const imageX = leftMargin;
      const textX = imageX + imageWidth + gap;

      let startY = 13;
      const lineHeight = 3;

      const textLines = [
        'GOVERNMENT OF MEGHALAYA',
        'OFFICE OF THE DIRECTOR MEGHALAYA STATE LOTTERY, SHILLONG',
        'CLAIM APPLICATION FOR PRIZE OF THE MEGHALAYA STATE LOTTERIES',
        'Form 1',
        '(Claim For Prize Amount above Rs. 10,000/-)',
        'PLEASE FILL IN THE FORM IN ENGLISH ONLY AND IN CAPITAL LETTERS.',
        'PLEASE READ INSTRUCTIONS OVERLEAF BEFORE SUBMITTING THE FORM',
      ];
      const form1Index = 3; // Index of "Form 1" line

      // Set text styles for the header text
      setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');

      // Calculate vertical centering for image and text block
      const textHeight = textLines.length * lineHeight;
      const maxHeight = Math.max(imageHeight, textHeight);
      const verticalCenter = startY + maxHeight / 2;

      // Calculate Y positions to vertically center both image and text
      const imageY = verticalCenter - imageHeight / 2;
      let textStartY = verticalCenter - textHeight / 2 + lineHeight; // +lineHeight because text is drawn from baseline

      // Draw top-left image
      doc.addImage(imgData, 'PNG', imageX, imageY, imageWidth, imageHeight);

      // Draw each line of header text centered horizontally within text container
      textLines.forEach((line, index) => {
        const textWidth = doc.getTextWidth(line);
        const x = textX + (textContainerWidth - textWidth) / 2;
        const y = textStartY + index * 4;

        if (index === form1Index) {
          // Draw gray background rectangle for "Form 1"
          const paddingX = 0; // horizontal padding
          const paddingY = 0; // vertical padding

          doc.setFillColor(186, 222, 250); // light blue (#badefa)
          doc.rect(
            x - paddingX,
            y - lineHeight + paddingY,
            textWidth + 4 * paddingX,
            4,
            'F' // fill (no border)
          );

          // Draw "Form 1" text on top
          setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');
          doc.text(line, x, y);
        } else {
          // Normal text
          setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');
          doc.text(line, x, y);
        }
      });

      // Now, add the divider line **after** the image and text block (after the last text line)
      const lastTextLineY = textStartY + (textLines.length - 1) * lineHeight+3;
      const dividerY = lastTextLineY + lineHeight + 3// Position the divider below the text
      doc.setDrawColor(169, 169, 169); // Grey color for the divider
      doc.setLineWidth(1); // Thickness of the divider
      doc.line(leftMargin, dividerY, pageWidth - rightMargin, dividerY); // Draw the divider line

      // Add the new set of text lines after the divider
      const LefttextLines = [
        'To',
        'The Director',
        'Meghalaya State Lottery,',
        'Government of Meghalaya',
        'Shillong, Meghalaya,',
        'SUB : Claim application for Prize of the Meghalaya State Lotteries',
        'CLAIM DETAILS:'
      ];

      let leftTextStartY = dividerY + lineHeight+2; // Position below the divider

      // Set text styles for the new lines (optional: use normal style)
      setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'normal');

      LefttextLines.forEach((line, index) => {
        const y = leftTextStartY + index * 5;
        if (index === 5 || index === 6) {
        setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');
        }
        // Left-align the text at the left margin
        doc.text(line, leftMargin, y);
});

// Create placeholder for passport-sized photo on the right
const photoBoxWidth = 30;
const photoBoxHeight = 30; // Adjust height as needed
const photoBoxX = pageWidth - rightMargin - photoBoxWidth - 5; // 5px padding from the right
const photoBoxY = leftTextStartY; // Start right below the left-aligned text

// Draw the rectangle for passport photo
doc.setDrawColor(0, 0, 0); // Border color (black)
doc.setLineWidth(0);
doc.rect(photoBoxX, photoBoxY, photoBoxWidth, photoBoxHeight);

// Add text inside the passport-sized photo placeholder with centered alignment and spacing
const insidetextLines = [
  'Paste',
  'Passport Size',
  'Photograph',
  'Here',
];

// Calculate vertical centering of the text inside the rectangle
const textHeightInside = insidetextLines.length * lineHeight;
const verticalCenterText = photoBoxY + (photoBoxHeight - textHeightInside) / 2;

setTextStyles(doc, [0, 0, 0], 'helvetica', 8, 'normal');

// Loop through each line of text and place them centered inside the photo box
insidetextLines.forEach((line, index) => {
  const textWidth = doc.getTextWidth(line);
  const x = photoBoxX + (photoBoxWidth - textWidth) / 2; // Center horizontally inside the box
  const y = verticalCenterText + index * lineHeight;
  doc.text(line, x, y); // Add the line of text
});
// Define the dynamic name (could come from a state or prop in the future)
console.log("username: ",userName);
const fullName = userName; // This will be dynamic

// Set text styles for this new field (normal style)
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');

// Define the starting Y position for the full name label
const fullNameStartY = leftTextStartY + (LefttextLines.length * 5.5) + 0; 

// Draw label text for "Full Name"
const labelText = 'Full Name of the Prize Winner (Beneficiary):';
const labelAddress = 'Address : _______________________________________________________________________________';
const AddressLine1 = '                _______________________________________________________________________________';
const labelFather = 'Father/ Spouse Name : ____________________________________________________________________';
const labelcontact =  'Contact No. (Compulsary) : _________________________________________________________________';
const labelEmail =  'Email Id : _______________________________________________________________________________';
const labelPan =  'PAN : __________________________________________________________________________________';
const labelAaadhar =  'Aadhar Number : _________________________________________________________________________';
const labelnameofbeneficiary = 'Name of the Prize Winner (Beneficiary): _______________________________________________________';
const labelaccountno = 'A/c No. : ________________________________________________________________________________';
const labelifsc = 'IFSC Code No. : __________________________________________________________________________';
const labelbranch = 'Name of Bank, Branch : ____________________________________________________________________';
const labelbankaddress = 'Address : _______________________________________________________________________________';
const labelBankAccount = 'Bank Account Details:';
const labelwinning= 'Winning Ticket Details:';
const labellottery = 'Name of Lottery: _________________________________________________________________________';
const labeldrawdate = 'Date of Draw : __________________________________Time: ____________________________________';
const labelticketno = 'Ticket Number : __________________________________________________________________________';
const labelRankprize = 'Rank of Prize : _____________________________________Prize Amount:Rs.________________________';
const labelnameofretailer = 'Name of Retailer (Point of Sale) : ____________________________________________________________';

const fullNameTextX = leftMargin + doc.getTextWidth(labelText) + 2; // Adjust X position to align with label
const addressStartY = fullNameStartY + lineHeight +3; // Add a little space between the name and address
const addressLineStartY = addressStartY + lineHeight + 4;
const addressLine1StartY = addressLineStartY + lineHeight + 4;
const fatherStartY = addressLine1StartY + lineHeight + 4;
const contactStartY = fatherStartY + lineHeight + 4;
const emailStartY = contactStartY + lineHeight + 4;
const panStartY = emailStartY + lineHeight + 4;
const aadharStartY = panStartY + lineHeight + 4;
const bankAccountStartY = aadharStartY + lineHeight + 4;
const nameStartY = bankAccountStartY + lineHeight + 4;
const accnoStartY = nameStartY + lineHeight + 4;
const ifscStartY = accnoStartY + lineHeight + 4;
const branchStartY = ifscStartY + lineHeight + 4;
const branchaddressStartY = branchStartY + lineHeight + 4;
const winninStartY = branchaddressStartY + lineHeight + 4;
const lotteryStartY = winninStartY + lineHeight + 4;
const drawStartY = lotteryStartY + lineHeight + 4;
const ticketStartY = drawStartY + lineHeight + 4;
const rankStartY = ticketStartY + lineHeight + 4;
const retailerStartY = rankStartY + lineHeight + 4;
const signatureLineStartY = retailerStartY + lineHeight + 8;

doc.text(labelText, leftMargin, fullNameStartY);
doc.text(fullName, fullNameTextX, fullNameStartY);
doc.text(labelAddress, leftMargin, addressStartY);
doc.text(AddressLine1, leftMargin, addressLineStartY);
doc.text(AddressLine1, leftMargin, addressLine1StartY);
doc.text(labelFather, leftMargin, fatherStartY);
doc.text(labelcontact, leftMargin, contactStartY);
doc.text(labelEmail, leftMargin, emailStartY);
doc.text(labelPan, leftMargin, panStartY);
doc.text(labelAaadhar, leftMargin, aadharStartY);
// Add the "Bank Account Details:" heading text
setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');
doc.text(labelBankAccount, leftMargin, bankAccountStartY);
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');
doc.text(labelnameofbeneficiary, leftMargin, nameStartY);
doc.text(labelaccountno, leftMargin, accnoStartY);
doc.text(labelifsc, leftMargin, ifscStartY);
doc.text(labelbranch, leftMargin, branchStartY);
doc.text(labelbankaddress, leftMargin, branchaddressStartY);
setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');
doc.text(labelwinning, leftMargin, winninStartY);
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');
doc.text(labellottery, leftMargin, lotteryStartY);
doc.text(labeldrawdate, leftMargin, drawStartY);
doc.text(labelticketno, leftMargin, ticketStartY);
doc.text(labelRankprize, leftMargin, rankStartY);
doc.text(labelnameofretailer, leftMargin, retailerStartY);

// Draw the smaller line (fixed length, let's say 100px long)
const lineLength = 50; // Adjust this length as needed
const lineEndX = pageWidth - rightMargin - lineLength; // Calculate the end of the line, moving it left from the right margin
doc.setDrawColor(0, 0, 0); // Black color for the line
doc.setLineWidth(0); // Set the thickness of the line
doc.line(pageWidth - rightMargin, signatureLineStartY, lineEndX, signatureLineStartY); // Draw the line

// Set the text for "Signature" right-aligned
const signatureText = 'Signature';
const signatureTextWidth = doc.getTextWidth(signatureText); // Calculate the text width
const signatureTextX = pageWidth - 40 - signatureTextWidth; // Right-align the text

// Set text style for "Signature" (normal style)
setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');

// Add the "Signature" text right-aligned after the line
doc.text(signatureText, signatureTextX, signatureLineStartY + lineHeight);
// --- ENCL. (Enclosures Section) ---
const marginLeft = 15;
const marginRight = 20;
const textcontentWidth = pageWidth - marginLeft - marginRight;
let cursorY = signatureLineStartY + lineHeight * 3 // start below signature with some space
// Heading for Enclosure section
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'bold');
doc.text('ENCL.:', marginLeft, cursorY);
cursorY += 5;
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');
const enclosures = [
  "Original Prize Winning Ticket.",
  "Self attested Aadhar Photo Copy",
  "Self Attested PAN card photo copy. In case of No PAN card please provide - As Enclosed - Annexure- 1",
  "Passport size photographs",
  "Affidavit duly attested by Notary (On Rs.20/- Stamp Paper.) as enclosed - Annexure- 2"
];
enclosures.forEach((text, index) => {
  const number = `${index + 1}. `;
  const numberWidth = doc.getTextWidth(number);

  // Wrap the text, considering indentation
  const splitText = doc.splitTextToSize(text, textcontentWidth - numberWidth);

  // First line with number
  doc.text(number + splitText[0], marginLeft, cursorY);
  cursorY += lineHeight;

  // Remaining lines with indent
  for (let i = 1; i < splitText.length; i++) {
    doc.text(splitText[i], marginLeft + numberWidth, cursorY);
    cursorY += lineHeight;
  }

  cursorY += 2; // extra spacing between items
});
doc.addPage();
// Define the page width and height (for watermark and border positioning)
const newPageWidth = doc.internal.pageSize.getWidth();
const newPageHeight = doc.internal.pageSize.getHeight();

try {
  //const imgData = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png'); // Your watermark image
  // Set watermark properties (centered)
  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const watermarkX = (newPageWidth - watermarkWidth) / 2;
  const watermarkY = (newPageHeight - watermarkHeight) / 2;

  // Set opacity for watermark (light opacity, 0.2)
  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
  doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity
} catch (error) {
  console.error('Error loading image for watermark', error);
}

// Draw border on new page
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0);
doc.rect(10, 10, newPageWidth - 20, newPageHeight - 20);
const textLinesHeading = [
  'INSTRUCTIONS',
  'CLAIM FORM FOR PRIZE OF THE MEGHALAYA STATE LOTTERIES',
];

// Set general text styles once before the loop
setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');

const lineHeightpage2 = 5; // adjust as needed
const textStartYPage2 = 20;  // starting Y position for instructions
const margin = 20;

// Render heading centered
textLinesHeading.forEach((line, index) => {
  const textWidth = doc.getTextWidth(line);
  const x = (newPageWidth - textWidth) / 2; // center align
  const y = textStartYPage2 + index * lineHeightpage2;
  doc.text(line, x, y);
});

// Set normal style for instructions
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');

const instructions = [
  "Write your name address and signature on the back of the ticket. Complete the claim form as per the instructions provided. Indicate the prize amount legibly.",
  "The winning ticket and claim form must be completed in the name of one individual or legal entity.",
  "Prize amount up to Rupees Ten Thousand (10,000/-) shall be paid by the Retailer.",
  "Prize amount above Rupees Ten Thousand (10,000/-) shall be paid by the Director State Lotteries, Government of Meghalaya subject to deduction of Income Tax payable on the prize amount. The prize amount shall be claimed by submitting a claim form along with 4 passport size photographs duly attested by a first class magistrate / notary. The claim needs to be sent to the Meghalaya Government directly by registered post at claimant's own risk. Payment will be made after deducting the tax as applicable on the date.",
  "Prize will be given only on complete physical verification of the documents, tickets and proof of identity.",
  "Incomplete forms shall be considered invalid.",
  "Government of Meghalaya is not responsible for any non-delivery of mails, loss in transit or non-receipt of forms dispatched by the claimant.",
  "The prize amount will be paid directly by the Government of Meghalaya and sent to the address mentioned in the claim form. Such payment will be subject to Tax deduction at source.",
  "Government or Marketing Agents / Distributors is entitled to use the winner's name, photograph and other information for promotional and / or publicity purposes and the claimant agrees to the same without any further claim for payment.",
  "Any dispute regarding the payment of prize shall be subject to exclusive jurisdiction of the courts in Meghalaya only.",
  "Prize should be claimed within 30 days from its declaration.",
  "Government of Meghalaya may advise you to submit more information over and above mentioned in the claim form.",
  "All the columns of the claim forms should be filled in completely and correctly with the information for speedy disposal of the claim by the Department."
];

let instructionsCursorY = textStartYPage2 + textLinesHeading.length * lineHeightpage2 + 5; // start below heading

// Loop through and render each instruction
instructions.forEach((text, index) => {
  const number = `${index + 1}. `;
  const splitText = doc.splitTextToSize(text, newPageWidth - marginLeft - marginRight - 10); // wrap text with some indent space
  const numberedLine = number + splitText[0];

  // Draw first line (with number)
  doc.text(numberedLine, marginLeft, instructionsCursorY);
  instructionsCursorY += lineHeightpage2;

  // Draw remaining lines (with indent)
  for (let i = 1; i < splitText.length; i++) {
    doc.text(splitText[i], marginLeft + 10, instructionsCursorY); // indent
    instructionsCursorY += lineHeightpage2;
  }
  instructionsCursorY += 2; // extra space between points
});

doc.setDrawColor(0, 0, 0); // Black color for the line
doc.setLineWidth(0); // Set the thickness of the line
doc.line(pageWidth - rightMargin, instructionsCursorY, lineEndX, instructionsCursorY);// Draw the line


// Set text style for "Signature" (normal style)
setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'bold');

// Add the "Signature" text right-aligned after the line
doc.text(signatureText, signatureTextX, instructionsCursorY + lineHeight);
doc.setDrawColor(169, 169, 169); // Grey color
doc.setLineWidth(1);
doc.line(leftMargin, instructionsCursorY + 8, pageWidth - rightMargin, instructionsCursorY + 8);
const acknowledgmentStartY = instructionsCursorY + 15 ;
const acknowledgmentText = 
  'Received with thanks from, The Director, Meghalaya State Lotteries, Shillong ' +
  'Rs.____________________________ (Rupees_____________ only) towards my claim of ticket ' +
  'No.__________________ of _______________ Lottery, Draw No. __________________________________ ' +
  'held on __________________________';
// Set text style
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');
const wrappedAcknowledgment = doc.splitTextToSize(acknowledgmentText, pageWidth - leftMargin - rightMargin);
const acknowledgmentLineHeight = 6;
// Draw each line with spacing
wrappedAcknowledgment.forEach((line, index) => {
  doc.text(line, leftMargin, acknowledgmentStartY + index * acknowledgmentLineHeight);
});
// Add the wrapped text
//doc.text(wrappedAcknowledgment, leftMargin, acknowledgmentStartY);
// --- Positioning for the "Name / Address" section and Revenue Stamp box ---
const sectionStartY = acknowledgmentStartY + wrappedAcknowledgment.length * 6 + 3;
// Name and Address block (left side)
const nameAddressLines = [
  'Name: ',
  'Address:',
];
// Set text style
setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'normal');
// Render each line of name/address
nameAddressLines.forEach((line, index) => {
  const y = sectionStartY + index * 8;
  doc.text(line, leftMargin, y);
});
// --- Revenue Stamp Placeholder (right side) ---
const stampBoxSize = 30; // Square box (40x40 mm)
const stampBoxX = pageWidth - rightMargin - stampBoxSize;
const stampBoxY = sectionStartY; // Align top with name field
doc.setDrawColor(0, 0, 0); // black border
doc.setLineWidth(0.5);
doc.rect(stampBoxX, stampBoxY, stampBoxSize, stampBoxSize);
// Optional: Add centered text inside the stamp box
const stampTextLines = [ 'Revenue', 'Stamp'];
setTextStyles(doc, [0, 0, 0], 'helvetica', 8, 'normal');
const textHeightInsideStamp = stampTextLines.length * lineHeight;
const verticalCenterY = stampBoxY + (stampBoxSize - textHeightInsideStamp) / 2;
stampTextLines.forEach((line, index) => {
  const textWidth = doc.getTextWidth(line);
  const x = stampBoxX + (stampBoxSize - textWidth) / 2;
  const y = verticalCenterY + index * lineHeight;
  doc.text(line, x, y);
});
doc.addPage();


try {
 // const imgData = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png'); // Your watermark image
  // Set watermark properties (centered)
  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const watermarkX = (newPageWidth - watermarkWidth) / 2;
  const watermarkY = (newPageHeight - watermarkHeight) / 2;

  // Set opacity for watermark (light opacity, 0.2)
  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
  doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity
} catch (error) {
  console.error('Error loading image for watermark', error);
}

// Draw border on new page
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0);
doc.rect(10, 10, newPageWidth - 20, newPageHeight - 20);
const textLinesHeadingPage3 = [
  'Income-tax Rules, 1962',
  'FORMNO. 60',
  '[See second proviso to rule 114B]',
  'Form for declaration to be filed by an individual or a person(not being a company or firm)',
  'who does not have a permanent account number and who enters into any',
  'transaction specified in rule 114B'
];

// Set general text styles once before the loop
setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'normal');


// Render heading centered
textLinesHeadingPage3.forEach((line, index) => {
  const textWidth = doc.getTextWidth(line);
  const x = (newPageWidth - textWidth) / 2; // center align
  const y = textStartYPage2 + index * lineHeightpage2;
  if (index === 1) {
  setTextStyles(doc, [0, 0, 0], 'helvetica', 10, 'bold');
    const x = (newPageWidth - textWidth) / 2; // center align
  const y = textStartYPage2 + index * lineHeightpage2;
  }else{
  setTextStyles(doc, [0, 0, 0], 'helvetica', 9, 'normal');
  }
  doc.text(line, x, y);
});
// Set initial X and Y after the heading section
let formStartX = 20;
let formStartY = textStartYPage2 + textLinesHeadingPage3.length * lineHeightpage2 + 5;
let labelWidth = 60;
let fieldWidth = 100;
let rowHeight = 8;

// Draw the vertical index cell (for '1')
doc.rect(formStartX, formStartY, 10, rowHeight * 3); // Vertical merged cell for row number
doc.text('1', formStartX + 3, formStartY + rowHeight * 1.8); // Center the '1' text

// Labels
const labels = ['First Name', 'Middle Name', 'Surname'];
labels.forEach((label, i) => {
  const y = formStartY + i * rowHeight;

  // Draw label cell
  doc.rect(formStartX + 10, y, labelWidth, rowHeight);
  doc.text(label, formStartX + 12, y + 5); // Add padding

  // Draw field cell with yellow background
  doc.setFillColor(255, 255, 204); // light yellow
  doc.rect(formStartX + 10 + labelWidth, y, fieldWidth, rowHeight, 'F'); // 'F' = filled
  doc.rect(formStartX + 10 + labelWidth, y, fieldWidth, rowHeight, 'S'); // border stroke
});
// Draw the vertical index cell for '2' (one row height)
let secondRowY = formStartY + rowHeight * 3; // Just below the previous 3-row section
doc.setFillColor(255, 255, 255); // white fill or skip if you want transparent
doc.rect(formStartX, secondRowY, 10, rowHeight, 'F'); // fill
doc.rect(formStartX, secondRowY, 10, rowHeight, 'S'); // border stroke
doc.text('2', formStartX + 3, secondRowY + 5); // slightly down for vertical centering

// Draw the label and field for DOB
const dobLabel = 'Date of Birth/Incorporation of declarant';
doc.rect(formStartX + 10, secondRowY, labelWidth, rowHeight, 'S'); // label border
doc.text(dobLabel, formStartX + 12, secondRowY + 5);

doc.setFillColor(255, 255, 204); // yellow fill
const smallBoxCount = 8;
const smallBoxWidth = 12.5; // width of each small box (adjust as needed)
const smallBoxHeight = rowHeight;

const startX = formStartX + 10 + labelWidth; // position just after label box


doc.setFillColor(255, 255, 204); // yellow fill

// Draw the 8 small boxes with fill and border
for (let i = 0; i < smallBoxCount; i++) {
  const boxX = startX + i * smallBoxWidth;
  doc.rect(boxX, secondRowY, smallBoxWidth, smallBoxHeight, 'F'); // fill
  doc.rect(boxX, secondRowY, smallBoxWidth, smallBoxHeight, 'S'); // border
}

// Add letters inside the small boxes
const letters = ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'];
doc.setFontSize(9);
letters.forEach((letter, i) => {
  const textX = startX + i * smallBoxWidth + smallBoxWidth / 2;
  const textY = secondRowY + smallBoxHeight - 3; // tweak for vertical centering
  doc.text(letter, textX, textY, { align: 'center' });
});
// Calculate Y position for third row — below previous rows
let thirdRowY = formStartY + rowHeight * 4; // since previous took 3 rows + 1 row for DOB

// Draw vertical index cell with number "3"
doc.setFillColor(255, 255, 255); // white fill or transparent
doc.rect(formStartX, thirdRowY, 10, rowHeight, 'F'); // fill
doc.rect(formStartX, thirdRowY, 10, rowHeight, 'S'); // border
doc.text('3', formStartX + 3, thirdRowY + 5); // center number vertically

// Draw label cell with text
const fathersNameLabel = "Father's Name (in case of individual)";
doc.rect(formStartX + 10, thirdRowY, labelWidth, rowHeight, 'S'); // border
doc.text(fathersNameLabel, formStartX + 12, thirdRowY + 5);

// Draw yellow input cell next to label
doc.setFillColor(255, 255, 204); // yellow fill
doc.rect(formStartX + 10 + labelWidth, thirdRowY, fieldWidth, rowHeight, 'F'); // fill
doc.rect(formStartX + 10 + labelWidth, thirdRowY, fieldWidth, rowHeight, 'S'); // border
// === ROW 4 ===
let fourthRowY = formStartY + rowHeight * 5; // Row 1 (3 rows) + Row 2 (1 row) + Row 3 (1 row)

// Reuse the same labels as Row 1
const row4Labels = ['First Name', 'Middle Name', 'Surname'];

// Draw merged index cell for Row 4 (3 rows high)
doc.setFillColor(255, 255, 255);
doc.rect(formStartX, fourthRowY, 10, rowHeight * 3, 'F'); // fill
doc.rect(formStartX, fourthRowY, 10, rowHeight * 3, 'S'); // border
doc.setTextColor(0, 0, 0);
doc.text('', formStartX + 3, fourthRowY + rowHeight * 1.8); // center vertically

// Draw label + yellow input fields for First/Middle/Surname
row4Labels.forEach((label, i) => {
  const y = fourthRowY + i * rowHeight;

  // Label cell
  doc.rect(formStartX + 10, y, labelWidth, rowHeight, 'S');
  doc.text(label, formStartX + 12, y + 5);

  // Input field
  doc.setFillColor(255, 255, 204); // yellow fill
  doc.rect(formStartX + 10 + labelWidth, y, fieldWidth, rowHeight, 'F'); // fill
  doc.rect(formStartX + 10 + labelWidth, y, fieldWidth, rowHeight, 'S'); // border
});
// Row start Y (first side-by-side row starts at row 4)
let baseRowY = formStartY + rowHeight * 8; // adjust if previous rows change
const indexCellWidth = 10;
const labelWidth4to9 = 37.5;
const fieldWidthto9 = 37.5;
const fullCellWidth = labelWidth4to9 + fieldWidthto9;
const rowHeightFull = 12;
const halfRowHeight = rowHeightFull / 2;

// Labels for indices 4 to 9
const labelsto9 = [
  'Flat/Room No.',
  'Floor No.',
  'Name of premises',
  'Block Name/No.',
  'Road/Street/Lane',
  'Area/Locality','Town/City','District'
];

// Loop through in pairs (i.e., 4-5, 6-7, 8-9)
for (let i = 0; i < labelsto9.length; i += 2) {
  let currentX = formStartX;
  let currentY = baseRowY + (i / 2) * rowHeightFull;

  for (let j = 0; j < 2; j++) {
    const indexNumber = 4 + i + j; // actual index from 4 to 9
    const label = labelsto9[i + j];

    // Index cell
    doc.setFillColor(255, 255, 255);
    doc.rect(currentX, currentY, indexCellWidth, rowHeightFull, 'F');
    doc.rect(currentX, currentY, indexCellWidth, rowHeightFull, 'S');
    doc.text(String(indexNumber), currentX + 3, currentY + 7);
    currentX += indexCellWidth;
    
    if (indexNumber === 11) {
      const halfCellWidth = fullCellWidth / 2;

      // Top half: split label into two inner labels
      doc.rect(currentX, currentY, halfCellWidth, halfRowHeight, 'S');
      doc.text('District', currentX + 2, currentY + 4);

      doc.rect(currentX + halfCellWidth, currentY, halfCellWidth, halfRowHeight, 'S');
      doc.text('State', currentX + halfCellWidth + 2, currentY + 4);

      // Bottom half: split input cells
      doc.setFillColor(255, 255, 204);
      doc.rect(currentX, currentY + halfRowHeight, halfCellWidth, halfRowHeight, 'F');
      doc.rect(currentX, currentY + halfRowHeight, halfCellWidth, halfRowHeight, 'S');

      doc.setFillColor(255, 255, 204);
      doc.rect(currentX + halfCellWidth, currentY + halfRowHeight, halfCellWidth, halfRowHeight, 'F');
      doc.rect(currentX + halfCellWidth, currentY + halfRowHeight, halfCellWidth, halfRowHeight, 'S');

      currentX += fullCellWidth;
    } else {
      // Normal single label + input cells
      doc.rect(currentX, currentY, fullCellWidth, halfRowHeight, 'S');
      doc.text(label, currentX + 2, currentY + 4);

      doc.setFillColor(255, 255, 204);
      doc.rect(currentX, currentY + halfRowHeight, fullCellWidth, halfRowHeight, 'F');
      doc.rect(currentX, currentY + halfRowHeight, fullCellWidth, halfRowHeight, 'S');

      currentX += fullCellWidth;
    }
  }
}
// // === ROW 5 & 6 side by side (Stacked Label/Input) ===
// let row56Y = formStartY + rowHeight * 8; // Adjust based on previous content

// // Sizes
// const indexCellWidth = 10;
// const labelWidth56 = 37.5;
// const fieldWidth56 = 37.5;
// const fullCellWidth = labelWidth56 + fieldWidth56;
// const rowTotalHeight = 12; // total row height
// const halfRowHeight = rowTotalHeight / 2;

// // === Column 1 (Index 4: Flat/RoomNo.) ===
// let currentX56 = formStartX;

// // Index cell
// doc.setFillColor(255, 255, 255);
// doc.rect(currentX56, row56Y, indexCellWidth, rowTotalHeight, 'F');
// doc.rect(currentX56, row56Y, indexCellWidth, rowTotalHeight, 'S');
// doc.text('4', currentX56 + 3, row56Y + 7); // adjusted Y for better vertical alignment
// currentX56 += indexCellWidth;

// // Label (top half)
// doc.rect(currentX56, row56Y, fullCellWidth, halfRowHeight, 'S');
// doc.text('Flat/RoomNo.', currentX56 + 2, row56Y + 4);

// // Input (bottom half)
// doc.setFillColor(255, 255, 204);
// doc.rect(currentX56, row56Y + halfRowHeight, fullCellWidth, halfRowHeight, 'F');
// doc.rect(currentX56, row56Y + halfRowHeight, fullCellWidth, halfRowHeight, 'S');

// currentX56 += fullCellWidth;

// // === Column 2 (Index 5: Floor No) ===

// // Index cell
// doc.setFillColor(255, 255, 255);
// doc.rect(currentX56, row56Y, indexCellWidth, rowTotalHeight, 'F');
// doc.rect(currentX56, row56Y, indexCellWidth, rowTotalHeight, 'S');
// doc.text('5', currentX56 + 3, row56Y + 7);
// currentX56 += indexCellWidth;

// // Label (top half)
// doc.rect(currentX56, row56Y, fullCellWidth, halfRowHeight, 'S');
// doc.text('Floor No', currentX56 + 2, row56Y + 4);

// // Input (bottom half)
// doc.setFillColor(255, 255, 204);
// doc.rect(currentX56, row56Y + halfRowHeight, fullCellWidth, halfRowHeight, 'F');
// doc.rect(currentX56, row56Y + halfRowHeight, fullCellWidth, halfRowHeight, 'S');
// Starting Y for new row (one rowHeightFull below the last row from before)
const nextRowY = baseRowY + ((labelsto9.length / 2)) * rowHeightFull;

const labels121314 = [
  'Pin code',
  'Telephone Number (with STD code)',
  'Mobile Number'
];

const totalCells = labels121314.length;

let currentX = formStartX;
let currentY = nextRowY;

for (let i = 0; i < totalCells; i++) {
  const indexNumber = 12 + i;
  const label = labels121314[i];
  
  // Set width: 40 for Telephone Number (i === 1), else 50
  let cellWidth121314 = (i === 1) ? 60 : 40;

  // Index cell
  doc.setFillColor(255, 255, 255);
  doc.rect(currentX, currentY, indexCellWidth, rowHeightFull, 'F');
  doc.rect(currentX, currentY, indexCellWidth, rowHeightFull, 'S');
  doc.text(String(indexNumber), currentX + 3, currentY + 7);
  currentX += indexCellWidth;

  // Label cell (top half)
  doc.rect(currentX, currentY, cellWidth121314, halfRowHeight, 'S');
  doc.text(label, currentX + 2, currentY + 4);

  // Input cell (bottom half)
  doc.setFillColor(255, 255, 204);
  doc.rect(currentX, currentY + halfRowHeight, cellWidth121314, halfRowHeight, 'F');
  doc.rect(currentX, currentY + halfRowHeight, cellWidth121314, halfRowHeight, 'S');

  currentX += cellWidth121314;
}

// Calculate Y position for "Amount of transaction" row — place below previous rows
let amountRowY = nextRowY + rowHeightFull; // below Pincode/Telephone/Mobile row

// Constants
const amountLabelWidth = 60;
const amountFieldWidth = 100;
const amountIndex = 15; // corrected index number

// Reset X for new line
currentX = formStartX;

// Index cell
doc.setFillColor(255, 255, 255); 
doc.rect(currentX, amountRowY, 10, rowHeight, 'F');
doc.rect(currentX, amountRowY, 10, rowHeight, 'S');
doc.text(String(amountIndex), currentX + 3, amountRowY + 6); // Adjust Y for centering
currentX += 10;

// Label cell
const amountoftransactionLabel = "Amount of transaction (Rs.)";
doc.rect(currentX, amountRowY, amountLabelWidth, rowHeight, 'S');
doc.text(amountoftransactionLabel, currentX + 2, amountRowY + 6);

// Input cell
doc.setFillColor(255, 255, 204);
doc.rect(currentX + amountLabelWidth, amountRowY, amountFieldWidth, rowHeight, 'F');
doc.rect(currentX + amountLabelWidth, amountRowY, amountFieldWidth, rowHeight, 'S');

// === Index 16: Another 8-box field like DOB ===

// Set Y position appropriately — adjust as per layout
let row16Y = nextRowY + rowHeightFull + rowHeight; // for example, below "Amount of transaction"
const index16 = 16;
const label16 = 'Date of transaction'; // <-- Customize label here

// Index cell
doc.setFillColor(255, 255, 255);
doc.rect(formStartX, row16Y, 10, rowHeight, 'F');
doc.rect(formStartX, row16Y, 10, rowHeight, 'S');
doc.text(String(index16), formStartX + 3, row16Y + 5);

// Label cell
doc.rect(formStartX + 10, row16Y, labelWidth, rowHeight, 'S');
doc.text(label16, formStartX + 12, row16Y + 5);

// Small boxes (8 boxes: DDMMYYYY)
const smallBoxCount16 = 8;
const smallBoxWidth16 = 12.5;
const smallBoxHeight16 = rowHeight;
const startX16 = formStartX + 10 + labelWidth;

doc.setFillColor(255, 255, 204); // yellow fill

for (let i = 0; i < smallBoxCount16; i++) {
  const boxX = startX16 + i * smallBoxWidth16;
  doc.rect(boxX, row16Y, smallBoxWidth16, smallBoxHeight16, 'F'); // fill
  doc.rect(boxX, row16Y, smallBoxWidth16, smallBoxHeight16, 'S'); // border
}

// Add format letters
const letters16 = ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'];
doc.setFontSize(9);
letters16.forEach((letter, i) => {
  const textX = startX16 + i * smallBoxWidth16 + smallBoxWidth16 / 2;
  const textY = row16Y + smallBoxHeight16 - 3;
  doc.text(letter, textX, textY, { align: 'center' });
});

// Calculate Y position for row 16 — below previous row
let sixteenRowY = row16Y+rowHeight;
const amountLabelWidth1 = 130;
const amountFieldWidth1 = 30;
const amountIndex1 = 15; // corrected index number
// Reset X
currentX = formStartX;

// Index cell (Index 16)
doc.setFillColor(255, 255, 255); 
doc.rect(currentX, sixteenRowY, 10, rowHeight, 'F');
doc.rect(currentX, sixteenRowY, 10, rowHeight, 'S');
doc.text('17', currentX + 3, sixteenRowY + 6); // Index number
currentX += 10;

// Label cell
const jointLabel = "In case of transaction in joint names, number of persons involved in the transaction";
doc.rect(currentX, sixteenRowY, amountLabelWidth1, rowHeight, 'S');
doc.text(jointLabel, currentX + 2, sixteenRowY + 6); // Correct label text

// Input cell
doc.setFillColor(255, 255, 204);
doc.rect(currentX + amountLabelWidth1, sixteenRowY, amountFieldWidth1, rowHeight, 'F');
doc.rect(currentX + amountLabelWidth1, sixteenRowY, amountFieldWidth1, rowHeight, 'S');

// === Index 18: Mode of transaction with full border including checkboxes ===

// Y position below previous row (Row 16)
let row18Y = sixteenRowY + rowHeight ;

// Outer box dimensions
const outerBoxX = formStartX + 10; // Skip index cell
const outerBoxY = row18Y;
const outerBoxWidth = 160;         // Enough to fit 3 checkboxes per row
const outerBoxHeight = rowHeight * 3; // 1 row for label, 2 rows for checkboxes

// Draw index cell (covers full height of the outer box)
doc.setFillColor(255, 255, 255);
doc.rect(formStartX, row18Y, 10, outerBoxHeight, 'F');
doc.rect(formStartX, row18Y, 10, outerBoxHeight, 'S');
doc.text('18', formStartX + 3, row18Y + rowHeight + 4); // vertically centered

// Draw outer box to cover label + checkboxes
doc.rect(outerBoxX, outerBoxY, outerBoxWidth, outerBoxHeight, 'S');

// Label text (top row inside outer box)
const modeOfTransactionLabel = "Mode of transaction:";
doc.text(modeOfTransactionLabel, outerBoxX + 2, outerBoxY + 6);

// Checkboxes (start drawing below the label row)
const options = [
  'Cash', 'Cheque', 'Card',
  "Draft/Banker's Cheque", 'Online transfer', 'Other'
];

const checkboxSize = 4;
const optionSpacing = 52; // space between each checkbox group
const checkboxStartX = outerBoxX + 2.5;
const checkboxStartY = outerBoxY + rowHeight; // start below label

for (let i = 0; i < options.length; i++) {
  const col = i % 3;
  const row = Math.floor(i / 3);

  const boxX = checkboxStartX + col * optionSpacing;
  const boxY = checkboxStartY + row * rowHeight + 2;

  // Draw checkbox
  doc.rect(boxX, boxY, checkboxSize, checkboxSize, 'S');

  // Draw label next to checkbox
  doc.text(options[i], boxX + checkboxSize + 2, boxY + checkboxSize);
}

// === Index 19: Aadhaar Number issued by UIDAI (if available) ===

// Y position (below Mode of Transaction outer box)
let aadhaarRowY = row18Y + rowHeight * 3 ; // 3 rows tall + spacing

const aadhaarLabelWidth = 100;
const aadhaarFieldWidth = 60;
const aadhaarIndex = 19;

currentX = formStartX;

// Index cell
doc.setFillColor(255, 255, 255); 
doc.rect(currentX, aadhaarRowY, 10, rowHeight, 'F');
doc.rect(currentX, aadhaarRowY, 10, rowHeight, 'S');
doc.text(String(aadhaarIndex), currentX + 3, aadhaarRowY + 6); // '19'
currentX += 10;

// Label cell
const aadhaarLabel = "Aadhaar Number issued by UIDAI (if available)";
doc.rect(currentX, aadhaarRowY, aadhaarLabelWidth, rowHeight, 'S');
doc.text(aadhaarLabel, currentX + 2, aadhaarRowY + 6);

// Input cell
doc.setFillColor(255, 255, 204);
doc.rect(currentX + aadhaarLabelWidth, aadhaarRowY, aadhaarFieldWidth, rowHeight, 'F');
doc.rect(currentX + aadhaarLabelWidth, aadhaarRowY, aadhaarFieldWidth, rowHeight, 'S');
// === Index 20: PAN applied but not generated ===

let row20Y = aadhaarRowY + rowHeight; // Adjusted from previous row

const index20 = 20;
const label20 = "If applied for PAN and it is not yet generated, enter date of application and acknowledgement number";
const label20Width = 60;
const ackFieldWidth = 100;


currentX = formStartX;

// Index cell
doc.setFillColor(255, 255, 255);
doc.rect(currentX, row20Y, 10, rowHeight, 'F');
doc.rect(currentX, row20Y, 10, rowHeight, 'S');
doc.text(String(index20), currentX + 3, row20Y + 6);
currentX += 10;

// Label cell (allowing for wrapped text)
doc.rect(currentX, row20Y, label20Width, rowHeight, 'S');
doc.setFontSize(7); // Adjust font if long text
doc.text(doc.splitTextToSize(label20, label20Width - 4), currentX + 2, row20Y + 4);

// Date boxes (8 small yellow fields)
const startDateBoxX = currentX + label20Width;
for (let i = 0; i < smallBoxCount; i++) {
  const boxX = startDateBoxX + i * smallBoxWidth;
  doc.setFillColor(255, 255, 204);
  doc.rect(boxX, row20Y, smallBoxWidth, smallBoxHeight, 'F'); // fill
  doc.rect(boxX, row20Y, smallBoxWidth, smallBoxHeight, 'S'); // border
}
doc.setFillColor(255, 255, 204); // yellow fill

// Add format letters
const letters20 = ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'];
doc.setFontSize(10);
letters20.forEach((letter, i) => {
  const textX = startX16 + i * smallBoxWidth + smallBoxWidth / 2;
  const textY = row20Y + smallBoxHeight - 3;
  doc.text(letter, textX, textY, { align: 'center' });
});
// === Index 21: Label only row (no input field) ===
let row21Y = row20Y + rowHeight; // Position below the previous row

const index21 = 21;
const label21Width = 160;
const label21 = "If PAN not applied, fill estimated total income (including income of spouse, minor child etc. as per section 64 of Income-tax Act, 1961) for the financial year in which the above transaction is held";

// Reset X
currentX = formStartX;

// Draw index cell
doc.setFillColor(255, 255, 255);
doc.rect(currentX, row21Y, 10, rowHeight * 1.5, 'F'); // double height if multiline
doc.rect(currentX, row21Y, 10, rowHeight * 1.5, 'S');
doc.text(String(index21), currentX + 3, row21Y + rowHeight); // centered
currentX += 10;

// Draw label cell (multi-line)
doc.rect(currentX, row21Y, label21Width, rowHeight * 1.5, 'S');

const wrappedText = doc.splitTextToSize(label21, label21Width - 4);
doc.setFontSize(9); // smaller font for long label
doc.text(wrappedText, currentX + 2, row21Y + 5);
// === Rows "a" and "b" ===

// Position below the previous row (Row 21)
let rowA_Y = row21Y + rowHeight+4; // space after previous label-only row
let rowB_Y = rowA_Y + rowHeight;

// Label and field widths
const abLabelWidth = 60;
const abFieldWidth = 110;

// --- Row (a): Agricultural income ---
currentX = formStartX;

// Label cell
doc.rect(currentX, rowA_Y, abLabelWidth, rowHeight, 'S');
doc.text('a) Agricultural income (Rs.)', currentX + 2, rowA_Y + 6);

// Input field
doc.setFillColor(255, 255, 204); // yellow fill
doc.rect(currentX + abLabelWidth, rowA_Y, abFieldWidth, rowHeight, 'F');
doc.rect(currentX + abLabelWidth, rowA_Y, abFieldWidth, rowHeight, 'S');

// --- Row (b): Other than agricultural income ---
currentX = formStartX;

doc.rect(currentX, rowB_Y, abLabelWidth, rowHeight, 'S');
doc.text('b) Other than agricultural income (Rs.)', currentX + 2, rowB_Y + 6);

doc.setFillColor(255, 255, 204);
doc.rect(currentX + abLabelWidth, rowB_Y, abFieldWidth, rowHeight, 'F');
doc.rect(currentX + abLabelWidth, rowB_Y, abFieldWidth, rowHeight, 'S');

doc.addPage();
try {
  //const imgData = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png'); // Your watermark image
  // Set watermark properties (centered)
  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const watermarkX = (newPageWidth - watermarkWidth) / 2;
  const watermarkY = (newPageHeight - watermarkHeight) / 2;

  // Set opacity for watermark (light opacity, 0.2)
  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
  doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity
} catch (error) {
  console.error('Error loading image for watermark', error);
}

// Draw border on new page
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0);
doc.rect(10, 10, newPageWidth - 20, newPageHeight - 20);
// Assuming newPageWidth and newPageHeight are defined

const marginpage3 = 20;
const totalWidth = newPageWidth - 2 * marginpage3;

// Example: first cell narrow, others wider but can customize each width
const cellWidths = [
  10, // first cell (index number)
  (totalWidth - 30) * 0.5, // second cell (40% of remaining)
  (totalWidth - 30) * 0.15, // third cell (15% of remaining)
  (totalWidth - 30) * 0.15, // fourth cell (15% of remaining)
  (totalWidth - 30) * 0.34 // fifth cell (30% of remaining)
];

const cellHeight = 25;
const initialRowY = 20;
const rowSpacing = 0;

const allRows = [
  [
    '22',
    'Details of document being produced in support of identity in Column 1 (Refer Instruction overleaf)',
    'Document code',
    'Document identification number',
    'Name and address of the authority issuing the document'
  ],
  [
    '23',
    'Details of document being produced in support of address in Columns 4 to 13 (Refer Instruction overleaf)',
    'Document code',
    'Document identification number',
    'Name and address of the authority issuing the document'
  ]
];

allRows.forEach((rowLabels, rowIndex) => {
  let cellX = marginpage3; // Start X at left margin
  const rowY = initialRowY + rowIndex * (cellHeight + rowSpacing);

  for (let i = 0; i < cellWidths.length; i++) {
    const cellWidth = cellWidths[i];

    // Draw cell rectangle
    doc.rect(cellX, rowY, cellWidth, cellHeight);

    // Split text to fit cell width with padding
    const textLines = doc.splitTextToSize(rowLabels[i], cellWidth - 4);
    const textYStart = rowY + 6;

    if (i === 0) {
      // Center align first cell text
      const totalTextHeight = textLines.length * 5;
      const textYCentered = rowY + (cellHeight - totalTextHeight) / 2 + 5;

      textLines.forEach((line, lineIndex) => {
        const lineY = textYCentered + lineIndex * 5;
        doc.text(line, cellX + cellWidth / 2, lineY, { align: 'center' });
      });
    } else {
      // Left align other cells
      textLines.forEach((line, lineIndex) => {
        const lineY = textYStart + lineIndex * 5;
        doc.text(line, cellX + 2, lineY);
      });
    }

    // Move X for next cell
    cellX += cellWidth;
  }
});
// After table, add heading "Verification"
const totalRowsHeight = allRows.length * (cellHeight + rowSpacing);
const headingY = initialRowY + totalRowsHeight + 10; // 10 units gap after table
doc.setFont(undefined, 'bold');
doc.setFontSize(10);
doc.text("Verification", newPageWidth / 2, headingY, { align: 'center' });
doc.setFont(undefined, 'normal'); // reset font to normal

// Declaration text below heading
const declarationMarginX = marginpage3;
const declarationWidth = newPageWidth - 2 * marginpage3;
const declarationTopY = headingY + 10;  // space after the heading

const declarationText = `I, ______________________________________________, do hereby declare that what is stated above is true to the best of my knowledge and belief. I further declare that I do not have a Permanent Account Number and my/our estimated total income (including income of spouse, minor child etc. as per section 64 of Income-tax Act, 1961) computed in accordance with the provisions of Income-tax Act, 1961 for the financial year in which the above transaction is held will be less than maximum amount not chargeable to tax.
Verified today, the __________ day of _______ 20___________`;

// Split into lines to fit the width
const declarationLines = doc.splitTextToSize(declarationText, declarationWidth);

// Draw each line starting from declarationTopY with some line height
declarationLines.forEach((line, index) => {
  doc.text(line, declarationMarginX, declarationTopY + index * 7);
});

// Calculate Y position after declaration text for "Place" and "Signature"
const afterDeclarationY = declarationTopY + declarationLines.length * 7 + 5; // 10pt padding after declaration

// Add "Place" and "Signature" text on same line
const leftText = "Place:_________________";
const rightText = "(Signature of declarant)";

doc.setFont(undefined, 'normal'); // normal font
doc.setFontSize(10);

// Left side text (Place)
doc.text(leftText, marginpage3, afterDeclarationY);
// Right side text (Signature) - right aligned
doc.text(rightText, newPageWidth - marginpage3, afterDeclarationY, { align: 'right' });

// Position variables (adjust spacing as needed)
const noteStartY = declarationTopY + declarationLines.length * 7 + 20;
const noteMarginX = marginpage3;
const noteWidth = newPageWidth - 2 * marginpage3;

// Draw bold "Note:" heading
doc.setFont("helvetica", "bold");
doc.text("Note:", noteMarginX, noteStartY);

// Reset to normal font for note body
doc.setFont("helvetica", "normal");

const noteText = `1. Before signing the declaration, the declarant should satisfy himself that the information furnished in this form is true, correct and complete in all respects. Any person making a false statement in the declaration shall be liable to prosecution under section 277 of the Income-tax Act, 1961 and on conviction be punishable,
(i) in a case where tax sought to be evaded exceeds twenty-five lakh rupees, with rigorous imprisonment which shall not be less than six months but which may extend to seven years and with fine;
(ii) in any other case, with rigorous imprisonment which shall not be less than three months but which may extend to two years and with fine.
2. The person accepting the declaration shall not accept the declaration where the amount of income of the nature referred to in item 22b exceeds the maximum amount which is not chargeable to tax, unless PAN is applied for and column 21 is duly filled.`;

// Split the note text into lines for wrapping
const noteLines = doc.splitTextToSize(noteText, noteWidth);
noteLines.forEach((line, index) => {
  // Add some indent to the note lines, say 10pt from left margin for better readability
  doc.text(line, noteMarginX, noteStartY + 7 * (index + 1));
});

doc.addPage();

try {
 // const imgData = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png'); // Your watermark image

  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const watermarkX = (newPageWidth - watermarkWidth) / 2;
  const watermarkY = (newPageHeight - watermarkHeight) / 2;

  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
  doc.setGState(new doc.GState({ opacity: 1 }));
} catch (error) {
  console.error('Error loading image for watermark', error);
}

// Draw border on new page
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0);
doc.rect(10, 10, newPageWidth - 20, newPageHeight - 20);

// Set starting position for Instruction text on this new page
const instructionStartY = 20; // Starting 30pt from top of page (adjust as needed)
const instructionMarginX = marginpage3;
const instructionWidth = newPageWidth - 2 * marginpage3;

// Draw bold "Instruction:" heading
doc.setFont("helvetica", "bold");
doc.text("Instruction:", instructionMarginX, instructionStartY);

// Reset font for normal text
doc.setFont("helvetica", "normal");

const instructionText = `(1) Documents which can be produced in support of identity and address (not required if applied for PAN and 
item 20 is filled): -`;

const instructionLines = doc.splitTextToSize(instructionText, instructionWidth);

// Draw the instruction lines below the heading
instructionLines.forEach((line, index) => {
  doc.text(line, instructionMarginX, instructionStartY + lineHeight * (index + 2));
});

// Calculate dynamic Y start for table after the instruction text block with a margin
const instructiontableStartY = instructionStartY + instructionLines.length * lineHeight + 5;
const instructiontableMarginX = marginpage3;
const instructiontableWidth = newPageWidth - 2 * instructiontableMarginX;

const instructioncellWidths = [
  10,                          // Sl.
  instructiontableWidth * 0.5,  // Nature of Document
  instructiontableWidth * 0.15, // Document Code
  instructiontableWidth * 0.15, // Proof of Identity
  instructiontableWidth * 0.15  // Proof of Address
];

const InstructionallRows = [
  ['Sl.', 'Nature of Document', 'Document code', 'Proof of Identity', 'Proof of Address'],
  ['A', 'For Individuals and HUF', '', '', ''],
  ['1.', 'AADHAAR card', '01', 'YES', 'YES'],
  ['2.', 'Bank/Post office passbook bearing photograph of the person', '02', 'YES', 'YES'],
  ['3.', 'Elector’s photo identity card', '03', 'YES', 'YES'],
  ['4.', 'Ration/Public Distribution System card bearing photograph of the person', '04', 'YES', 'YES'],
  ['5.', 'Driving License', '05', 'YES', 'YES'],
  ['6.', 'Passport', '06', 'YES', 'YES'],
  ['7.', 'Pensioner Photo card', '07', 'YES', 'YES'],
  ['8.', 'National Rural Employment Guarantee Scheme (NREGS) job card', '08', 'YES', 'YES'],
  ['9.', 'Caste or Domicile certificate bearing photo of the person', '09', 'YES', 'YES'],
  ['10.', 'Certificate of identity/address signed by a Member of Parliament or Member of Legislative Assembly or Municipal Councillor or a Gazetted Officer as per annexure A', '10', 'YES', 'YES'],
  ['11.', 'Certificate from employer as per annexure B prescribed in Form 49A', '11', 'YES', 'YES'],
  ['12.', 'Kisan passbook bearing photo', '12', 'YES', 'YES'],
  ['13.', 'Arm’s license', '13', 'YES', 'YES'],
  ['14.', 'Central Government Health Scheme / Ex-servicemen Contributory Health Scheme card', '14', 'YES', 'YES'],
  ['15.', 'Photo identity card issued by the government / Public Sector Undertaking', '15', 'YES', 'NO'],
  ['16.', 'Electricity bill (Not more than 3 months old)', '16', 'NO', 'YES'],
  ['17.', 'Landline Telephone bill (Not more than 3 months old)', '17', 'NO', 'YES'],
  ['18.', 'Water bill (Not more than 3 months old)', '18', 'NO', 'YES'],
  ['19.', 'Consumer gas card/book or piped gas bill (Not more than 3 months old)', '19', 'NO', 'YES'],
];


// Custom row height function (optional)
function getRowHeight(rowIndex, calculatedHeight) {
  const specialRows = [0, 3, 5, 9, 10,12, 15,16, 18,20];
  const specialrow = [11]
  if (specialRows.includes(rowIndex)) {
    return 14;  // Fixed height for special rows
  }
  if(specialrow.includes(rowIndex)){
   return 21;
  }
  return 8;  // Fixed height for other rows
}


// Initialize currentY properly with assignment operator (=)
let currentY1 = instructiontableStartY;
const rowSpacing1 = 2; // space between rows

InstructionallRows.forEach((rowLabels, rowIndex) => {
  let cellX = instructiontableMarginX;

  // Calculate max height of the row based on wrapped text
  let maxHeight = 0;
  const textLinesArray = [];

  for (let i = 0; i < instructioncellWidths.length; i++) {
    const cellWidth = instructioncellWidths[i];
    const lines = doc.splitTextToSize(rowLabels[i] || '', cellWidth - 4);
    textLinesArray.push(lines);

    const height = lines.length * 5 + 8; // line height * lines + padding
    if (height > maxHeight) maxHeight = height;
  }

  // Use custom height if needed
  const rowHeight = getRowHeight(rowIndex, maxHeight);

  // Set font style
  if (rowIndex === 0) {
    doc.setFont("helvetica", "normal");
  } else if (rowIndex === 1) {
    doc.setFont("helvetica", "bold");
  } else {
    doc.setFont("helvetica", "normal");
  }

  // Draw each cell
  for (let i = 0; i < instructioncellWidths.length; i++) {
    const cellWidth = instructioncellWidths[i];
    const textLines = textLinesArray[i];

    // Draw cell border
    doc.rect(cellX, currentY1, cellWidth, rowHeight);

    const textYStart = currentY1 + 4; // padding from top

    if (i === 0) {
      // Center align vertically and horizontally for first column
      const totalTextHeight = textLines.length * 5;
      const textYCentered = currentY1 + (rowHeight - totalTextHeight) / 2 + 3;

      textLines.forEach((line, lineIndex) => {
        const lineY = textYCentered + lineIndex * 5;
        doc.text(line, cellX + cellWidth / 2, lineY, { align: 'center' });
      });
    } else {
      // Left align for other columns
      textLines.forEach((line, lineIndex) => {
        const lineY = textYStart + lineIndex * 5;
        doc.text(line, cellX + 2, lineY);
      });
    }

    cellX += cellWidth;
  }

  // Increment Y position for next row
  currentY1 += rowHeight ;
});

// ⬅️ Add new page
doc.addPage();

// ⬅️ Add watermark
try {
 // const imgData = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png');
  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const watermarkX = (newPageWidth - watermarkWidth) / 2;
  const watermarkY = (newPageHeight - watermarkHeight) / 2;

  doc.setGState(new doc.GState({ opacity: 0.2 }));
  doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);
  doc.setGState(new doc.GState({ opacity: 1 }));
} catch (error) {
  console.error('Error loading image for watermark', error);
}

// ⬅️ Draw border
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0);
doc.rect(10, 10, newPageWidth - 20, newPageHeight - 20);

// ⬅️ Table setup
const additionalInstructionRows = [
  ['20.', 'Bank Account Statement (Not more than 3 months old)', '20', 'NO', 'YES'],
  ['21.', 'Credit Card statement (Not more than 3 months old)', '21', 'NO', 'YES'],
  ['22.', 'Depository Account Statement (Not more than 3 months old)', '22', 'NO', 'YES'],
  ['23.', 'Property registration document', '23', 'NO', 'YES'],
  ['24.', 'Allotment letter of accommodation from Government', '24', 'NO', 'YES'],
  ['25.', 'Passport of spouse bearing name of the person', '25', 'NO', 'YES'],
  ['26.', 'Property tax payment receipt (Not more than one year old)', '26', 'NO', 'YES'],
  ['B', 'For Association of persons (Trusts)', '', '', ''],
  ['27.', 'Copy of trust deed or certificate of registration issued by Charity Commissioner', '27', 'YES', 'YES'],
  ['C', 'For Association of persons (other than Trusts) or Body of Individuals or Local authority or Artificial Juridical Person', '', '', ''],
  ['28.', 'Copy of Agreement or certificate of registration issued by Charity Commissioner / Registrar of Cooperative Society / other authority or document issued by Government establishing identity and address of such person', '28', 'YES', 'YES']
];


// ✅ Adjusted table position to be just inside the top border
let currentY2 = 12;


additionalInstructionRows.forEach((rowLabels, rowIndex) => {
  let cellX = instructiontableMarginX;
  let maxHeight = 0;
  const textLinesArray = [];

  for (let i = 0; i < instructioncellWidths.length; i++) {
    const cellWidth = instructioncellWidths[i];
    const lines = doc.splitTextToSize(rowLabels[i] || '', cellWidth - 4);
    textLinesArray.push(lines);
    const height = lines.length * 5 + 8;
    if (height > maxHeight) maxHeight = height;
  }

  const rowHeight = maxHeight;

  // Bold section headers B and C
  if (rowLabels[0] === 'B' || rowLabels[0] === 'C') {
    doc.setFont("helvetica", "bold");
  } else {
    doc.setFont("helvetica", "normal");
  }

  for (let i = 0; i < instructioncellWidths.length; i++) {
    const cellWidth = instructioncellWidths[i];
    const textLines = textLinesArray[i];
    doc.rect(cellX, currentY2, cellWidth, rowHeight);

    const textYStart = currentY2+ 4;

    if (i === 0) {
      const totalTextHeight = textLines.length * 5;
      const textYCentered = currentY2+ (rowHeight - totalTextHeight) / 2 + 3;

      textLines.forEach((line, lineIndex) => {
        const lineY = textYCentered + lineIndex * 5;
        doc.text(line, cellX + cellWidth / 2, lineY, { align: 'center' });
      });
    } else {
      textLines.forEach((line, lineIndex) => {
        const lineY = textYStart + lineIndex * 5;
        doc.text(line, cellX + 2, lineY);
      });
    }

    cellX += cellWidth;
  }

  currentY2 += rowHeight;
});
doc.setFont("helvetica", "normal");

// Remaining instruction text to add after table
const remainingText = `(2) In case of a transaction in the name of a Minor, any of the abovementioned documents as proof of Identity and Address of any of parents/guardians of such minor shall be deemed to be the proof of identity and address for the minor declarant, and the declaration should be signed by the parent/guardian.

(3) For HUF any document in the name of Karta of HUF is required.

(4) In case the transaction is in the name of more than one person, the total number of persons should be mentioned in Sl.No.18 and the total amount of transaction is to be filled in Sl.No.16.

In case the estimated total income in column 22b exceeds the maximum amount not chargeable to tax, the person should apply for PAN, fill out item 21 and furnish proof of submission of application.`;

// Wrap text for paragraph
const paragraphLines = doc.splitTextToSize(remainingText, instructionWidth);

// Add spacing after table
let currentY3 = currentY2 + 10;

// Draw paragraph lines inside border
paragraphLines.forEach((line, index) => {
  doc.text(line, instructiontableMarginX, currentY3 + index * 6);
});

// Optional: update currentY if you want to add more content after this
currentY3 += paragraphLines.length * 6;

// Add another new page
doc.addPage();

// Add watermark on the new page (same logic as before)
try {
 // const imgData = await toDataURL('https://app.easylottery.in/img/MeghalayaLogo.png');
  const watermarkWidth = 100;
  const watermarkHeight = 100;
  const watermarkX = (newPageWidth - watermarkWidth) / 2;
  const watermarkY = (newPageHeight - watermarkHeight) / 2;

  if (doc.setGState) {
    doc.setGState(new doc.GState({ opacity: 0.2 }));
  }

  doc.addImage(imgData, 'PNG', watermarkX, watermarkY, watermarkWidth, watermarkHeight);

  if (doc.setGState) {
    doc.setGState(new doc.GState({ opacity: 1 }));
  }
} catch (error) {
  console.error('Error loading image for watermark on new page', error);
}

// Draw border on the new page
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);
doc.rect(10, 10, newPageWidth - 20, newPageHeight - 20);

// Define border margin and inside text margin
const borderMargin = 10;        // border drawn at 10px from edges
const insideMarginX = borderMargin + 10;  // 10 px inside border for text
const insideMarginY = borderMargin + 10;  // start 10 px inside border vertically

// Draw border on the new page
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);
doc.rect(borderMargin, borderMargin, newPageWidth - 2 * borderMargin, newPageHeight - 2 * borderMargin);

// Start Y position for text inside border
let currentY4= insideMarginY;

// 1. Annexure- 2 — right aligned & bold inside border
doc.setFont("helvetica", "bold");
doc.setFontSize(14);

const annexureText = "Annexure- 2";

doc.text(
  annexureText,
  newPageWidth - borderMargin - 10, // 10 px inside the right border
  currentY4,
  { align: "right" }
);

// Move down for the next section
currentY4 += 10;

// 2. Center aligned & bold heading lines inside border
doc.setFontSize(11);
const centerBoldText = [
  "FORMAT OF AFFIDAVIT TO BE SUBMITTED BY WINNERS (DULY ATTESTED BY NOTARY PUBLIC)",
  "ALONG WITH RESPECTIVE CLAIM FORMS.",
];


centerBoldText.forEach(line => {
  doc.text(line, newPageWidth / 2, currentY4, { align: "center" });
  currentY4 += lineHeight+4;
});

  doc.text("AFFIDAVIT", newPageWidth / 2, currentY4, { align: "center" });
  currentY4 += lineHeight+4;
// 3. Affidavit body text inside border
doc.setFont("helvetica", "normal");
doc.setFontSize(10);

const affidavitBody = `I___________________________________________ aged about _____________ years, son / daughter of
Shri.________________________________________________________________________ resident of
_____________________________________________________________________________ do hereby
solemnly affirm and declare as follows:
1. That I am a bonafide citizen of India by birth.
2. That I am the Sole Owner of Prize Winning Ticket No. _______________________________________ of
____________________________ Online/Paper Lottery of Draw No. __________________________ Dated
____________________________ of the _____________(prize rank) Prize of Rs. ___________________
3. That I will not claim the other prize or whatever I am not entitled to.
4. That I am the bonafide / genuine claimant of the _______________________ Prize of online/Paper lottery.
5. That there are no other claimant / winner of the Prize Winning Ticket No. ___________________________
of draw dated ___________________________________ of ________________online/Paper Lottery.
6. My Pan Number is ______________________________________________________________
7. My Aadhar Number is ___________________________________________________________
8. That the above facts are true to the best of my knowledge and belief
9. Dated the ________________________________ day of ___________________________________`;

const splitBody = doc.splitTextToSize(affidavitBody, newPageWidth - 2 * insideMarginX);

splitBody.forEach((line, idx) => {
  doc.text(line, insideMarginX, currentY4 + idx * 7);  // line height 7
});
// Calculate the final Y position after the body text
const finalY = currentY4 + splitBody.length * 7 + 15;  // 15px extra space after last line

// DEPONENT — right aligned & bold
doc.setFont("helvetica", "bold");
doc.setFontSize(12);
doc.text("DEPONENT", newPageWidth - insideMarginX, finalY, { align: "right" });

// Next line — Verified, affirmed... (left aligned, normal)
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.text(
  "Verified, affirmed and signed before me at ________________________ on ________________________",
  insideMarginX, // left margin inside border
  finalY + 10    // move to next line
);
// Save the PDF (download)
const pdfBlob = doc.output('blob');
const url = URL.createObjectURL(pdfBlob);
//  window.open(url);
// If you'd prefer to automatically save instead of opening the file, you can use doc.save() instead:
doc.save(`${referenceNumber}.pdf`);
// Prepare request payload
const requestData = {
  refreshToken,
  formstep: 'downloadform',
  id: schemeid,
  ids: referenceNumber
};

try {
  const response = await axios.post(
    'https://api.easylotto.in/reactDummy',
    requestData, // or use formData if needed
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'lang-policies-mode': 'max-age=0',
        'Content-Type': 'application/json', // match to requestData
      },
    }
  );

  if (response.status === 200) {
    console.log('Claim form data uploaded successfully.');
    toast.success("Claim form downloaded successfully.!");
    // You can show a toast here
  }
} catch (error) {
  console.error('Upload failed:', error);
  // You can show an error toast or alert here
}
    } catch (error) {
      console.error('Error loading image', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="action-button download-btn">
      <button
        className="action-button download-btn"
        onClick={handleDownloadTemplate}
        aria-label="Download Meghalaya claim form PDF template"
      >
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
          <path
            d="M10 12.8672V2.86719"
            stroke="#AD1E24"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 12.8672V16.2005C17.5 16.6425 17.3244 17.0665 17.0118 17.379C16.6993 17.6916 16.2754 17.8672 15.8333 17.8672H4.16667C3.72464 17.8672 3.30072 17.6916 2.98816 17.379C2.67559 17.0665 2.5 16.6425 2.5 16.2005V12.8672"
            stroke="#AD1E24"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.8335 8.70056L10.0002 12.8672L14.1668 8.70056"
            stroke="#AD1E24"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download Template
      </button>
    </div>
  );
};

export default DownloadClaimPdfForm;

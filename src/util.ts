import path from "path";
import { Item } from "./types/index";

export const generateReport = (pdf: PDFKit.PDFDocument, data: Item[]) => {
  createHeader(pdf);
  createReportIntro(pdf, data);
  createTable(pdf, data);
};

export const createHeader = (pdf: PDFKit.PDFDocument) => {
  pdf
    .image(path.join(__dirname, "..", "src", "Logo", "report.png"), 50, 45, {
      width: 50,
    })
    .fillColor("#444444")
    .fontSize(20)
    .fontSize(10)
    .text("456 abc Street", 200, 65, { align: "right" })
    .text("Abu Dhabi, AUH, 10092", 200, 80, { align: "right" })
    .moveDown();
};

export const createReportIntro = (pdf: PDFKit.PDFDocument, data: Item[]) => {
  pdf
    .text(`Report Number:     ${new Date().getTime()}`, 50, 200)
    .text(`Report Date:       ${new Date()}`, 50, 215)

    .moveDown();
};

export const createTable = (pdf: PDFKit.PDFDocument, data: Item[]) => {
  const numRowsPerPage = 25; // Number of rows to display per page
  let i = 0;
  let page = 1;
  let rowIndex = 0;

  while (i < data.length) {
    // Calculate the start and end index for the current page
    const startIndex = i;
    const endIndex = Math.min(i + numRowsPerPage, data.length);

    // Add column headers on the first page
    if (page === 1) {
      pdf.font("Helvetica-Bold");
      generateTableRow(pdf, 280, "ID", "Name", "Quantity", "Price");
      generateHr(pdf, 300);
      pdf.font("Helvetica");
      rowIndex = 1;
    }

    // Generate rows for the current page
    for (let j = startIndex; j < endIndex; j++) {
      const item = data[j];
      const position = 280 + (rowIndex + 1) * 20;
      generateTableRow(
        pdf,
        position,
        item.id,
        item.name,
        item.quantity + "",
        "$" + item.price + ""
      );
      generateHr(pdf, position + 10);
      rowIndex++;
    }

    // If there are more pages, add a new page and repeat the process
    if (endIndex < data.length) {
      pdf.addPage();
      page++;
      rowIndex = 0;
    }

    i = endIndex;
  }
};

export const generateHr = (pdf: PDFKit.PDFDocument, y: number) => {
  pdf.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

export const generateTableRow = (
  pdf: PDFKit.PDFDocument,
  y: number,
  id: string,
  name: string,
  quantity: string,
  price: string
) => {
  pdf
    .fontSize(10)
    .text(id, 50, y)
    .text(name, 150, y)
    .text(quantity + "", 360, y)
    .text(price + "", 420, y);
};

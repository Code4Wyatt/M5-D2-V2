// Import modules

import PdfPrinter from "pdfmake";
import striptags from "striptags";
import axios from "axios";


// Declare fonts

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

// Declare printer as a new PdfPrinter using the above fonts

const printer = new PdfPrinter(fonts);

// Generate blog PDF

export const generateBlogPDF = async (blog) => {
  let imagePart = {};
  if (blog.cover) {
    const response = await axios.get(blog.cover, {
      responseType: "arraybuffer",
    });
    const blogCoverURLParts = blog.cover.split("/");
    const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }
  const docDefinition = {
    content: [
      imagePart,
      { text: blog.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
      { text: striptags(blog.content), lineHeight: 2 },
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return pdfDoc;
};

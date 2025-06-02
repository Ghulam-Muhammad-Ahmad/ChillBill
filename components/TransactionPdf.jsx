import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DownloadIcon } from 'lucide-react';

if (!pdfMake.vfs) {
    pdfMake.vfs = pdfFonts.vfs;
  }

const TransactionPdf = ({ heading, transactions, currency = '₹', filename }) => {
  // Function to convert an image URL to a base64 string
  const getBase64Logo = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching logo:', error);
      return null;
    }
  };

  // Function to generate and download the PDF
  const generatePdf = async () => {
    const logo = await getBase64Logo('/chillbilllogo.png');

    const docDefinition = {
      content: [
        // Logo Image
        logo && {
          image: logo,
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        // Heading
        {
          text: heading,
          style: 'header',
        },
        // Transactions Table
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', '*'],
            body: [
              [
                { text: 'Date', style: 'tableHeader' },
                { text: 'Type', style: 'tableHeader' },
                { text: 'Category', style: 'tableHeader' },
                { text: 'Amount', style: 'tableHeader' },
                { text: 'Note', style: 'tableHeader' },
              ],
              ...transactions.map((t) => {
                const type = t.type || t.categoryType || (t.note ? 'Income' : 'Expense');
                const formattedDate = new Date(t.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                return [
                  { text: formattedDate, style: 'tableCell' },
                  { text: type, style: 'tableCell' },
                  { text: t.category || '—', style: 'tableCell' },
                  {
                    text: `${currency}${Number(t.amount).toLocaleString()}`,
                    style: 'tableCell',
                  },
                  { text: t.note || t.description || '—', style: 'tableCell' },
                ];
              }),
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f3f4f6' : null),
            hLineColor: () => '#ccc',
            vLineColor: () => '#ccc',
          },
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          color: '#C82121',
          margin: [0, 10, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 14,
          color: 'white',
          fillColor: '#38AF79',
          alignment: 'center',
          margin: [0, 5],
        },
        tableCell: {
          margin: [0, 5],
        },
        footer: {
          fontSize: 10,
          color: '#666',
          alignment: 'center',
        },
      },
      footer: (currentPage, pageCount) => {
        const now = new Date();
        const date = now.toLocaleDateString('en-US');
        const time = now.toLocaleTimeString('en-US');
        return {
          text: [
           `Generated on ${date}\n`,
            'Note: This is a system generated document. No signature required.\n',
            `Page ${currentPage} of ${pageCount}\n`,
          ],
          style: 'footer',
          margin: [0, 10, 0, 10],
        };
      },
    };

    const timestamp = new Date().toISOString().split('T')[0];
    const filenameWithTimestamp = `${filename || heading.replace(/\s+/g, '-')}-${timestamp}.pdf`;

    pdfMake.createPdf(docDefinition).download(filenameWithTimestamp);
  };

  return (
    <button
      onClick={generatePdf}
      className="ml-2 bg-primary hover:bg-secondary text-white py-2 px-4 rounded csm:ml-0 w-fit flex items-center gap-2"
    >
      Download PDF <DownloadIcon />
    </button>
  );
};

export default TransactionPdf;

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (artists) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Artists List', 14, 22);
  
  // Define the columns for the table
  const columns = [
    { header: 'ID', dataKey: 'artistId' },
    { header: 'Name', dataKey: 'artistName' },
    { header: 'Age', dataKey: 'age' },
    { header: 'Gender', dataKey: 'gender' },
    { header: 'Nationality', dataKey: 'nationality' },
    { header: 'Industry', dataKey: 'industry' }
  ];

  // Generate the table
  doc.autoTable({
    startY: 30,
    columns: columns,
    body: artists,
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [63, 81, 181] }
  });

  // Save the PDF
  doc.save('artists-list.pdf');
};

export const exportToExcel = (artists) => {
  const worksheet = XLSX.utils.json_to_sheet(artists);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Artists");
  
  // Save the file
  XLSX.writeFile(workbook, "artists-list.xlsx");
};

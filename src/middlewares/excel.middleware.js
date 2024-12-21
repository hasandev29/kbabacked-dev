import XLSX from 'xlsx';

export const extractDataFromExcel = async (req, res, next) => {

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheets = {};

    workbook.SheetNames.forEach(sheetName => { sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) });

    req.data = sheets;
    next();

  } catch (error) {
    return res.status(500).json({ message: 'Error processing the file.', error: error.message });
  }
};

export const exportExcel = (req, res, next) => {
  try {
    const { sheets, fileName } = res.locals.excelData;

    if (!sheets || !fileName) {
      throw new Error('Missing sheet data or file name.');
    }

    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ sheetName, data }) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error in exportExcel middleware:', error.message);
    res.status(500).json({ status: 'failed', message: 'Error generating Excel file', error: error.message });
  }
};
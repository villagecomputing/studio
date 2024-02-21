import Papa from 'papaparse';

function getCSVHeader(file: File): Promise<Papa.ParseResult<string>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
      preview: 1, // Only parse the first row
      complete: (results) => {
        if (results.meta.fields) {
          resolve({
            ...results,
            data: results.meta.fields,
          });
        }
        reject(new Error('No headers found in CSV file.'));
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

function parseCSV(
  file: File,
  withHeaders: boolean = true,
): Promise<Papa.ParseResult<unknown>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: withHeaders,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

const PapaParser = { getCSVHeader, parseCSV };
export default PapaParser;

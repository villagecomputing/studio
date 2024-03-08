import Papa from 'papaparse';

function getCSVHeader(file: File): Promise<Papa.ParseResult<string>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      header: true,
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

function parseCSV<T>(
  file: File,
  withHeaders: boolean = true,
): Promise<Papa.ParseResult<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(file, {
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

function parseCSVString<T>(
  csvString: string,
  withHeaders: boolean = true,
): Promise<Papa.ParseResult<T>> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(csvString, {
      header: withHeaders,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

function unparse(rows: unknown[]) {
  return Papa.unparse(rows);
}

export default { getCSVHeader, parseCSV, parseCSVString, unparse };

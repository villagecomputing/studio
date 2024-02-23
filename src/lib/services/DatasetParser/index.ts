import papaParser from '../PapaParser';

type ParserError = Papa.ParseError;
type ObjectFormatRow = { [columnName: string]: string };
type ArrayFormatRow = string[];

const handleParserError = (errors: ParserError[]) => {
  if (!errors.length) {
    return;
  }
  // display first error
  throw new Error(errors[0].message);
  //TODO: check what errors we should handle
  // https://www.papaparse.com/docs#:~:text=the%20header%20row.-,ERRORS,-//%20Error%20structure%0A%7B%0A%09type
};

const getHeader = async (file: File): Promise<string[]> => {
  const parseResult = await papaParser.getCSVHeader(file);
  // check parseResult.meta.renamedHeaders for Headers that are automatically renamed by the library to avoid duplication.
  handleParserError(parseResult.errors);
  return parseResult.data;
};

const parseAsArray = async (
  file: File,
): Promise<{ headers: string[]; rows: string[][] }> => {
  const parseResult = await papaParser.parseCSV<ArrayFormatRow>(file, false);
  handleParserError(parseResult.errors);
  return {
    headers: parseResult.data[0] as string[],
    rows: parseResult.data.slice(1),
  };
};
const parseAsObject = async (
  file: File,
): Promise<{ headers: string[]; rows: ObjectFormatRow[] }> => {
  const parseResult = await papaParser.parseCSV<ObjectFormatRow>(file, true);
  handleParserError(parseResult.errors);
  return {
    headers: parseResult.meta.fields ?? [],
    rows: parseResult.data,
  };
};
const getColumnFromObjectFormatData = (
  rows: ObjectFormatRow[],
  columnName: string,
): string[] => {
  return rows.map((row) => row[columnName] || '');
};

const getColumnFromArrayFormatData = (
  rows: ArrayFormatRow[],
  columnIndex: number,
): string[] => {
  return rows.map((row) => row[columnIndex] || '');
};

export default {
  getHeader,
  parseAsObject,
  parseAsArray,
  getColumnFromObjectFormatData,
  getColumnFromArrayFormatData,
};

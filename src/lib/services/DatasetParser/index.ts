import PapaParser from './PapaParser/PapaParser';

export type ParserError = Papa.ParseError;
type ObjectFormatRow = { [columnName: string]: string };
type ArrayFormatRow = string[];
export type ArrayParseResult = { headers: string[]; rows: ArrayFormatRow[] };
export type ObjectParseResult = { headers: string[]; rows: ObjectFormatRow[] };

const handleParserError = (errors: ParserError[]) => {
  // https://www.papaparse.com/docs#:~:text=the%20header%20row.-,ERRORS,-//%20Error%20structure%0A%7B%0A%09type
  if (!errors.length) {
    return;
  }
  // display first error
  throw new Error(errors[0].message);
};

const getHeader = async (file: File): Promise<string[]> => {
  const parseResult = await PapaParser.getCSVHeader(file);
  // check parseResult.meta.renamedHeaders for Headers that are automatically renamed by the library to avoid duplication.
  handleParserError(parseResult.errors);
  return parseResult.data;
};

const parseAsArray = async (csv: File | string): Promise<ArrayParseResult> => {
  let parseResult;
  if (typeof csv === 'string') {
    parseResult = await PapaParser.parseCSVString<ArrayFormatRow>(csv, false);
  } else {
    parseResult = await PapaParser.parseCSV<ArrayFormatRow>(csv, false);
  }
  handleParserError(parseResult.errors);
  return {
    headers: parseResult.data[0],
    rows: parseResult.data.slice(1),
  };
};
const parseAsObject = async (
  csv: File | string,
): Promise<ObjectParseResult> => {
  let parseResult;
  if (typeof csv === 'string') {
    parseResult = await PapaParser.parseCSVString<ObjectFormatRow>(csv);
  } else {
    parseResult = await PapaParser.parseCSV<ObjectFormatRow>(csv);
  }
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

import papaParser from '../papa-parse';

type ParserError = Papa.ParseError;

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

const parse = async (file: File, objectFormat?: boolean) => {
  const parseResult = await papaParser.parseCSV(file, objectFormat);
  handleParserError(parseResult.errors);
  return objectFormat
    ? { headers: parseResult.meta.fields, rows: parseResult.data }
    : {
        headers: parseResult.data[0],
        rows: parseResult.data.slice(1),
      };
};

const datasetParser = { getHeader, parse };
export default datasetParser;

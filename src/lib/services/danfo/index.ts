import { DataFrame, readCSV, readExcel } from 'danfojs';
import {
  ArrayType1D,
  ArrayType2D,
} from 'danfojs/dist/danfojs-base/shared/types';

const parseFile = async (file: File): Promise<DataFrame> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  switch (fileType) {
    case 'csv':
    case 'tsv':
      return await readCSV(file);
    case 'xlsx':
    case 'xls':
      return (await readExcel(file)) as DataFrame;
    default:
      throw new Error('Unsupported file type');
  }
};

const getHeaders = async (file: File): Promise<string[]> => {
  const df: DataFrame = await parseFile(file);
  return df.columns;
};
/**
 *
 * @param file
 * @returns Number of rows without the header row.
 */
const getRowsNumber = async (file: File): Promise<number> => {
  const df: DataFrame = await parseFile(file);
  return df.shape[0]; // shape[0] gives the number of rows
};

const getColumn = async (
  file: File,
  position: number,
): Promise<ArrayType1D | ArrayType2D> => {
  const df: DataFrame = await parseFile(file);

  if (position < 0 || position >= df.columns.length) {
    throw new Error('Column position out of range');
  }
  return df.column(df.columns[position]).values;
};

const parse = async (file: File) => {
  const dataFrame = await parseFile(file);
  return {
    headers: dataFrame.columns,
    dimensions: dataFrame.shape,
    rows: dataFrame.values,
  };
};

const danfoParser = { getHeaders, getRowsNumber, getColumn, parse };
export default danfoParser;

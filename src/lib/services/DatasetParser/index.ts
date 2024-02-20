import {
  ArrayType1D,
  ArrayType2D,
} from 'danfojs/dist/danfojs-base/shared/types';
import danfoParser from '../danfo';

type DatasetHeader = {
  index: number;
  name: string;
};

const getHeaders = async (file: File): Promise<DatasetHeader[]> => {
  try {
    return (await danfoParser.getHeaders(file)).map((cell, index) => ({
      index,
      name: cell,
    }));
  } catch (error) {
    // TODO: handle error! Maybe add error to  upload context
    console.error('Error getting headers:', error);
    throw error;
  }
};

const getRowsNumber = async (file: File): Promise<number> => {
  try {
    return await danfoParser.getRowsNumber(file);
  } catch (error) {
    // TODO: handle error! Maybe add error to  upload context
    console.error('Error getting rows number:', error);
    throw error;
  }
};
const getColumn = async (
  file: File,
  columnIndex: number,
): Promise<ArrayType1D | ArrayType2D> => {
  try {
    const columnValues = await danfoParser.getColumn(file, columnIndex);
    return columnValues;
  } catch (error) {
    // TODO: handle error! Maybe add error to  upload context
    console.error(`Error getting column ${columnIndex}:`, error);
    throw error;
  }
};

const parse = async (file: File) => {
  try {
    return await danfoParser.parse(file);
  } catch (error) {
    // TODO: handle error! Maybe add error to  upload context
    console.error(`Error parsing file ${file.name}:`, error);
    throw error;
  }
};

const datasetParser = { getHeaders, getRowsNumber, getColumn, parse };
export default datasetParser;

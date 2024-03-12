import { readLocalFile, saveFileLocally } from './utils';

async function saveFile(file: FormDataEntryValue, datasetTitle: string) {
  try {
    if (process.env.NODE_ENV === 'development' && typeof file !== 'string') {
      return await saveFileLocally(file, datasetTitle);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getFile(filepath: string) {
  if (!filepath) {
    return null;
  }
  try {
    if (process.env.NODE_ENV === 'development') {
      return await readLocalFile(filepath);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve the dataset file');
  }
}

export default { saveFile, getFile };

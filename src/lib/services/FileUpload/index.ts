import { saveFileLocally } from './utils';

async function saveFile(file: FormDataEntryValue, datasetTitle: string) {
  if (process.env.NODE_ENV === 'development' && typeof file !== 'string') {
    return await saveFileLocally(file, datasetTitle);
  }
}

export default { saveFile };

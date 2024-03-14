import { readStream, uint8ArrayToString } from './utils';

async function readFileAsStream(file: FormDataEntryValue) {
  if (typeof file === 'string') {
    throw new Error('Invalid file format');
  }
  const fileStream = file.stream();
  const fileContent = await readStream(fileStream);
  return uint8ArrayToString(fileContent);
}

export default { readFileAsStream };

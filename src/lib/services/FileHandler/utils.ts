import { appendExtensionBasedOnType } from '@/lib/utils';
import { promises as fs } from 'fs';
import { FileUploadResult } from './types';

export const UPLOAD_PATH = './public/uploads/';

export async function saveFileLocally(
  file: FormDataEntryValue,
  fileName: string,
): Promise<FileUploadResult> {
  if (typeof file === 'string') {
    throw new Error('The file is not an instance of File.');
  }
  const filePath = `${UPLOAD_PATH}${appendExtensionBasedOnType(fileName, file.type)}`;
  const data = await file.arrayBuffer();
  await fs.appendFile(filePath, Buffer.from(data));
  return {
    filePath,
    fileSize: file.size,
    fileType: file.type,
  };
}

export async function readLocalFile(filepath: string): Promise<string> {
  const file = await fs.readFile(`${process.cwd()}${filepath}`, 'utf8');
  return file;
}

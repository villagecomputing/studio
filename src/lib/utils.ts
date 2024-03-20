import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: use date-fns
export const formatDate = (date: string | Date): string => {
  const dateToFormat = new Date(date);
  const todayDate = new Date();
  if (
    dateToFormat.getFullYear() === todayDate.getFullYear() &&
    dateToFormat.getMonth() === todayDate.getMonth() &&
    dateToFormat.getDate() === todayDate.getDate()
  ) {
    return 'Today';
  }
  const formattedDate = dateToFormat.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formattedDate;
};

export function getFilenameWithoutExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}

export function appendExtensionBasedOnType(filename: string, type: string) {
  const filenameWithoutExtension = getFilenameWithoutExtension(filename);
  let newExtension;

  switch (type) {
    case 'text/csv':
      newExtension = '.csv';
      break;
    case 'text/tab-separated-values':
      newExtension = '.tsv';
      break;
    default:
      newExtension = '';
  }

  return filenameWithoutExtension + newExtension;
}

export function arraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export enum UUIDPrefixEnum {
  DATASET = 'd_',
  EXPERIMENT = 'e_',
}

export const generateUUID = (prefix?: UUIDPrefixEnum) => {
  const uuid = uuidv4();
  return prefix ? `${prefix}${uuid}` : uuid;
};

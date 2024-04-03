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

export function arrayContainsArray(arr1: string[], arr2: string[]) {
  // Convert both arrays to Sets for easier comparison
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Check if set2 is a subset of set1
  for (const item in set2) {
    if (!set1.has(item)) {
      return false;
    }
  }
  return true;
}

export enum UUIDPrefixEnum {
  DATASET = 'd-',
  EXPERIMENT = 'e-',
}

export const generateUUID = (prefix?: UUIDPrefixEnum) => {
  const uuid = uuidv4();
  return prefix ? `${prefix}${uuid}` : uuid;
};
function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_]/gi, '');
}

/**
 * Generates a fake ID for a dataset or an experiment.
 *
 * @param {string} name - The name of the dataset/experiment.
 * @param {string} uuid - The UUID associated with the dataset/experiment.
 * @returns {string} The fake ID, which is a sanitized version of the name concatenated with the UUID.
 */
export const createFakeId = (name: string, uuid: string): string => {
  const sanitizedName = sanitizeName(name);
  return `${sanitizedName}-${uuid}`;
};

/** 
  A UUID version 4 has 36 characters in total, which includes 32 hexadecimal characters and 4 hyphens 
  that are used to separate the UUID into 5 groups in the form of 8-4-4-4-12.
  Here is an example of a UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  Where x is any hexadecimal digit and y is one of 8, 9, A, or B.
*/
function isValidUUIDv4(uuid: string): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export const getDatasetUuidFromFakeId = (datasetFakeId: string) => {
  const datasetId = datasetFakeId.slice(-36 - UUIDPrefixEnum.DATASET.length);
  if (
    !isValidUUIDv4(datasetId.slice(-36)) ||
    !datasetId.startsWith(UUIDPrefixEnum.DATASET)
  ) {
    throw new Error('Invalid dataset id');
  }
  return datasetId;
};

export const getExperimentUuidFromFakeId = (experimentFakeId: string) => {
  const experimentId = experimentFakeId.slice(
    -36 - UUIDPrefixEnum.EXPERIMENT.length,
  );
  if (
    !isValidUUIDv4(experimentId.slice(-36)) ||
    !experimentId.startsWith(UUIDPrefixEnum.EXPERIMENT)
  ) {
    throw new Error('Invalid experiment id');
  }
  return experimentId;
};

import { PrismaClient as PrismaClientInit } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const PrismaClient = new PrismaClientInit();

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

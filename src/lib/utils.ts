import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

import { DateRange } from 'react-day-picker';

export type DateRangeFilter = {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
};

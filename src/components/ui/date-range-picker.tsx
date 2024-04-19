'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, subMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { HTMLAttributes, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

export function DatePickerWithRange(props: {
  className?: HTMLAttributes<HTMLDivElement>['className'];
  selectedDateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}) {
  const [date, setDate] = useState<DateRange | undefined>(
    props.selectedDateRange,
  );
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    setDate(props.selectedDateRange);
  }, [props.selectedDateRange]);

  const onSubmit = () => {
    props.setDateRange(date);
    setPopoverOpen(false);
  };
  const onReset = () => {
    setDate(undefined);
    props.setDateRange(undefined);
    setPopoverOpen(false);
  };

  return (
    <div className={cn('grid gap-2', props.className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-fit justify-start text-left font-normal')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              <>
                {format(date.from, 'LLL dd, y')}
                {date.to && ` - ${format(date.to, 'LLL dd, y')}`}
              </>
            ) : (
              <span>Date Range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-dialog w-auto rounded-lg border border-gridBorderColor p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from ?? subMonths(new Date(), 1)}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(date) =>
              isAfter(date, new Date()) ||
              isBefore(date, new Date('1900-01-01'))
            }
          />

          <div className=" flex w-full justify-end gap-2 pb-3 pr-3">
            <Button variant={'outline'} onClick={onReset}>
              Reset
            </Button>
            <Button type="submit" onClick={onSubmit}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

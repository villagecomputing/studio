import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useUploadDataContext } from '../UploadDataProvider';
import {
  ColumnHeader,
  DatasetColumnsListProps,
  UploadDataFormContext,
  UploadDataSchemaValues,
} from '../types';

export default function DatasetColumnsList(props: DatasetColumnsListProps) {
  const { field, searchTerm, disabled } = props;
  const { control } = useFormContext<UploadDataFormContext>();
  const { columnHeaders, setBlankGTColumnName, blankGTColumn } =
    useUploadDataContext();

  const [filteredItems, setFilteredItems] =
    useState<ColumnHeader[]>(columnHeaders);

  useEffect(() => {
    const filtered = columnHeaders.filter((item: ColumnHeader) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItems(filtered);
  }, [searchTerm, columnHeaders]);

  const RadioGroupContent = useMemo(() => {
    if (!columnHeaders.length) {
      return <>Nothing</>;
    }
    if (!filteredItems.length) {
      return (
        <FormDescription className="m-auto">
          No matching column found.
        </FormDescription>
      );
    }
    const blankGroundTruthOption = (
      <FormItem
        key={blankGTColumn.index}
        className="sticky top-0 flex items-baseline space-y-0 border-b-[1px] border-border bg-white py-3"
      >
        <FormControl>
          <RadioGroupItem value={blankGTColumn.index.toString()} />
        </FormControl>
        <FormLabel className="w-full cursor-pointer font-normal ">
          <FormField
            control={control}
            name={UploadDataSchemaValues.BLANK_GT_COLUMN_TITLE}
            render={({ field, fieldState }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Input
                    {...field}
                    className="border-none"
                    placeholder="Create new ground truth column"
                    onChange={(event) => {
                      field.onChange(event);
                      setBlankGTColumnName(event.target.value);
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage className="ml-3">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </FormLabel>
      </FormItem>
    );
    return filteredItems.map((item) => {
      if (item.index === blankGTColumn.index) {
        return blankGroundTruthOption;
      }
      return (
        <FormItem key={item.index} className="flex items-center space-y-0">
          <FormControl>
            <RadioGroupItem value={item.index.toString()} />
          </FormControl>
          <FormLabel className="w-full cursor-pointer pl-3 font-normal ">
            {item.name}
          </FormLabel>
        </FormItem>
      );
    });
  }, [columnHeaders, filteredItems]);

  return (
    <FormControl>
      <RadioGroup
        onValueChange={field.onChange}
        defaultValue={field.value}
        className="mt-0 flex h-60 flex-col gap-4 overflow-auto rounded-b-lg border border-t-0 border-border p-3 pt-0"
        disabled={disabled}
      >
        {RadioGroupContent}
      </RadioGroup>
    </FormControl>
  );
}

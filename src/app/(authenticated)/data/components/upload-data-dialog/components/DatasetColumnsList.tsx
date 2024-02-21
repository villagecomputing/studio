import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useUploadDataContext } from '../UploadDataProvider';
import {
  ColumnHeader,
  DatasetColumnsListProps,
  UploadDataFormContext,
  UploadDataSchemaValues,
} from '../types';

export default function DatasetColumnsList(props: DatasetColumnsListProps) {
  const { field, searchTerm } = props;
  const { setValue } = useFormContext<UploadDataFormContext>();
  const { columnHeaders } = useUploadDataContext();

  const [filteredItems, setFilteredItems] =
    useState<ColumnHeader[]>(columnHeaders);

  useEffect(() => {
    const filtered = columnHeaders.filter((item: ColumnHeader) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredItems(filtered);
  }, [searchTerm, columnHeaders]);

  const RadioGroupContent = () => {
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
    return filteredItems.map((item) => (
      <FormItem key={item.index} className="flex items-center space-y-0">
        <FormControl>
          <RadioGroupItem value={item.index.toString()} />
        </FormControl>
        <FormLabel className="w-full cursor-pointer pl-3 font-normal ">
          {item.name}
        </FormLabel>
      </FormItem>
    ));
  };

  return (
    <FormControl>
      <RadioGroup
        onValueChange={(value) => {
          setValue(
            UploadDataSchemaValues.GROUND_TRUTH_COLUMN_INDEX,
            Number(value),
          );
        }}
        defaultValue={field.value.toString()}
        className="mt-0 flex h-40 flex-col gap-4 overflow-auto rounded-b-lg border border-t-0 border-border p-3"
      >
        <RadioGroupContent />
      </RadioGroup>
    </FormControl>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import DatasetParser from '@/lib/services/DatasetParser';
import { UploadIcon } from 'lucide-react';
import React, { useRef } from 'react';

const UploadDataButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      // TODO: add file to upload context

      // !!! only for testing
      console.log('File selected:', files[0]);
      const headers = await DatasetParser.getHeaders(files[0]);
      const rowsNumber = await DatasetParser.getRowsNumber(files[0]);
      const column = await DatasetParser.getColumn(files[0], 0);
      const parse = await DatasetParser.parse(files[0]);
      console.log('🚀 ~ UploadDataButton ~ parse:', parse);
      console.log('🚀 ~ UploadDataButton ~ column[0]:', column);
      console.log('🚀 ~ UploadDataButton ~ rowsNumber:', rowsNumber);
      console.log('🚀 ~ UploadDataButton ~ headers:', headers);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".csv,.tsv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
      <Button onClick={handleClick}>
        <UploadIcon size={15} className="mr-2.5" strokeWidth={2.5} />
        Upload Data
      </Button>
    </>
  );
};

export default UploadDataButton;

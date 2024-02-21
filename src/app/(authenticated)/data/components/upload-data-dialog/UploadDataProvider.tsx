import datasetParser from '@/lib/services/DatasetParser';
import React, { ReactNode, createContext, useContext, useState } from 'react';
import { ColumnHeader, UploadDataContextType } from './types';

const UploadDataContext = createContext<UploadDataContextType | undefined>(
  undefined,
);

export const useUploadDataContext = () => {
  const context = useContext(UploadDataContext);
  if (!context) {
    throw new Error('useUploadData must be used within a UploadDataProvider');
  }
  return context;
};

export const UploadDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blankGroundTruthColumnAdded, setBlankGroundTruthColumnAdded] =
    useState<boolean>(false);
  const [columnHeaders, setColumnHeaders] = useState<ColumnHeader[]>([]);

  /**
   * This also works as a reset for the context
   */
  const onFileSelected = async (file: File | null) => {
    if (!file) {
      return;
    }
    const columns = await datasetParser.getHeader(file);
    setColumnHeaders(columns.map((column, index) => ({ index, name: column })));
    setBlankGroundTruthColumnAdded(false);
    setSelectedFile(file);
  };

  const addBlankGroundTruthColumn = () => {
    if (blankGroundTruthColumnAdded) {
      return;
    }
    setColumnHeaders([
      ...columnHeaders,
      { index: columnHeaders.length, name: 'Blank ground truth column' },
    ]);
    setBlankGroundTruthColumnAdded(true);
  };

  return (
    <UploadDataContext.Provider
      value={{
        selectedFile,
        columnHeaders,
        blankGroundTruthColumnAdded,
        onFileSelected,
        addBlankGroundTruthColumn,
      }}
    >
      {children}
    </UploadDataContext.Provider>
  );
};

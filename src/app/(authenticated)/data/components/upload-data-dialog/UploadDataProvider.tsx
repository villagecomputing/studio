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

  const onFileSelected = (file: File | null) => {
    if (!file) {
      return;
    }
    // TODO Add parse logic here
    setColumnHeaders([
      { index: 0, name: 'Column 1' },
      { index: 1, name: 'Column 2' },
      { index: 2, name: 'Column 3' },
    ]);
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

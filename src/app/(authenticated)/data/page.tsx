import { SearchInput } from '../components/search-input/SearchInput';
import UploadDataButton from './components/upload-data-button/UploadDataButton';
import ZeroState from './components/zero-state/ZeroState';

const DataPage = () => {
  return (
    <div>
      <div className={'my-6 flex items-center justify-between gap-5'}>
        <SearchInput />
        <UploadDataButton />
      </div>
      <ZeroState />
    </div>
  );
};

export default DataPage;

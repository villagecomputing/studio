'use client';
import Breadcrumb from '@/components/Breadcrumb';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import DataTable from '../../components/data-table/DataTable';
import { DEFAULT_GRID_OPTIONS } from '../../components/data-table/constants';
import { DatasetName } from '../../experiment/components/DatasetNameCellRenderer';
import { useExperimentListContext } from '../../experiment/components/ExperimentListProvider';
import ExperimentGrid from '../../experiment/utils/ExperimentGrid';
import { getExperimentsMetadataColumnsPercentiles } from '../../experiment/utils/utils';
import { useGroupSpecificData } from './hooks/useGroupSpecificData';
import { ExperimentGroupPageProps, ExperimentGroupRowType } from './types';

const ExperimentsGroupPage = (props: ExperimentGroupPageProps) => {
  const router = useRouter();
  const { experiments } = useExperimentListContext();
  const {
    params: { groupId },
  } = props;

  const groupSpecificExperiments = useMemo(() => {
    return experiments.filter(
      (experiment) => experiment.groupId === Number(groupId),
    );
  }, [experiments, groupId]);

  const { columnDefs, rowData } =
    ExperimentGrid.convertToExperimentGroupGridData(groupSpecificExperiments);

  const groupData = useGroupSpecificData(groupSpecificExperiments);

  const experimentsMetadataColumnsPercentiles = useMemo(() => {
    return getExperimentsMetadataColumnsPercentiles(groupSpecificExperiments);
  }, [groupSpecificExperiments]);

  return (
    <>
      <div className={cn(['flex items-center justify-between gap-2 px-6'])}>
        <Breadcrumb
          customSegments={{
            group: <Link href={`/experiment`}>Experiments</Link>,
          }}
        />
        <UserButton />
      </div>
      <div className="px-6">
        <div className={'my-6 flex items-center gap-6'}>
          <DatasetName
            id={groupData.datasetId}
            name={groupData.datasetName}
            variant="secondary"
          />
          <p className="line-clamp-2 max-w-3xl text-sm text-gridHeaderTextColor">
            {groupData.description}
          </p>
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <DataTable<ExperimentGroupRowType>
            theme="ag-theme-experiment-group-list"
            agGridProps={{
              ...DEFAULT_GRID_OPTIONS,
              onRowClicked: (event) => {
                if (!event.data) {
                  return;
                }
                router.push(`/experiment/${event.data.id}`);
              },
              context: experimentsMetadataColumnsPercentiles,
              rowData,
              columnDefs,
              domLayout: 'autoHeight',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ExperimentsGroupPage;

import DashboardTabs from '@/components/DashboardTabs';
import KPICards from '@/components/KPICards';
import { LoadFileForm } from '@/components/LoadFileForm';
import { calculateKPIMetrics, groupDividendsByMonth } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React, { useMemo } from 'react';

export default function DashboardLayout() {
  const fileData = useDividendsStore((s) => s.fileData);

  const kpiMetrics = useMemo(() => calculateKPIMetrics(fileData), [fileData]);

  const monthlyData = useMemo(
    () => groupDividendsByMonth(fileData),
    [fileData],
  );

  const hasData = fileData && fileData.length > 0;

  return (
    <>
      <div>
        <h1 className="pb-8 pt-8 text-center text-5xl">
          Tax Dividend Visualizer
        </h1>

        <div className="flex items-center justify-center">
          <LoadFileForm />
        </div>
      </div>

      {hasData && (
        <div className="container mx-auto space-y-6 px-4 py-8">
          <KPICards metrics={kpiMetrics} />
          <DashboardTabs chartData={monthlyData} />
        </div>
      )}
    </>
  );
}

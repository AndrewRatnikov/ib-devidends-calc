import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React, { Suspense, useMemo } from 'react';

import DividendsTableContent from './DividendsTableContent';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  const { startDate, endDate } = useMemo(
    () => getDateRangeFromFileData(fileData) || {},
    [fileData],
  );

  const promise = useFetchCurrencyExchange({ startDate, endDate });

  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <DividendsTableContent promise={promise} fileData={fileData} />
    </Suspense>
  );
}

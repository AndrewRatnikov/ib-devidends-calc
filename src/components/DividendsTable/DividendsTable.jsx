import { useFetchCurrencyExchange } from '@/hooks/useFetchCurrencyExchange';
import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React, { Suspense, useMemo } from 'react';

import CurrencyDataLoading from './CurrencyDataLoading';
import DividendsTableContent from './DividendsTableContent';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  const { startDate, endDate } = useMemo(
    () => getDateRangeFromFileData(fileData) || {},
    [fileData],
  );

  const promise = useFetchCurrencyExchange({ startDate, endDate });

  return (
    <Suspense fallback={<CurrencyDataLoading />}>
      <DividendsTableContent promise={promise} fileData={fileData} />
    </Suspense>
  );
}

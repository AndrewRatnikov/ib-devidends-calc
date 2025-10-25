import { Table, TableCaption } from '@/components/ui/table';
import useFetchCurrencyExchange from '@/hooks/useFetchCurrencyExchange';
import useHydratedDividends from '@/hooks/useHydratedDividends';
import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React, { useMemo } from 'react';

import DividendsTableHeader from './DividendsTableHeader';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  const { startDate, endDate } = useMemo(
    () => getDateRangeFromFileData(fileData) || {},
    [fileData],
  );

  const { data: currencyExchangeData, isLoading, isError } =
    useFetchCurrencyExchange({ startDate, endDate });

  const hydratedFileData = useHydratedDividends(fileData, currencyExchangeData);

  if (!hydratedFileData || !hydratedFileData.length || isLoading || isError) {
    return null;
  }

  return (
    <Table className="mt-5">
      <TableCaption>A list of dividends.</TableCaption>

      <DividendsTableHeader />
    </Table>
  );
}

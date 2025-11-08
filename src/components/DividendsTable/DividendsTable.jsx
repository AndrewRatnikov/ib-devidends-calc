import { Table, TableBody, TableCaption } from '@/components/ui/table';
import useDividendsSummary from '@/hooks/useDividendsSummary';
import useFetchCurrencyExchange from '@/hooks/useFetchCurrencyExchange';
import useHydratedDividends from '@/hooks/useHydratedDividends';
import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React, { useMemo } from 'react';

import DividendsTableHeader from './DividendsTableHeader';
import DividendsTableRow from './DividendsTableRow';
import DividendsTableSummaryRow from './DividendsTableSummaryRow';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  const { startDate, endDate } = useMemo(
    () => getDateRangeFromFileData(fileData) || {},
    [fileData],
  );

  const {
    data: currencyExchangeData,
    isLoading,
    isError,
  } = useFetchCurrencyExchange({ startDate, endDate });

  const hydratedFileData = useHydratedDividends(fileData, currencyExchangeData);
  const summary = useDividendsSummary(hydratedFileData);

  if (!hydratedFileData || !hydratedFileData.length || isLoading || isError) {
    return null;
  }

  return (
    <Table className="mt-5">
      <TableCaption>A list of dividends.</TableCaption>

      <DividendsTableHeader />

      <TableBody>
        {hydratedFileData.map((dividend) => (
          <DividendsTableRow key={dividend.id} data={dividend} />
        ))}
      </TableBody>
      <DividendsTableSummaryRow summary={summary} />
    </Table>
  );
}

import { Table, TableBody, TableCaption } from '@/components/ui/table';
import useDividendsSummary from '@/hooks/useDividendsSummary';
import useFetchCurrencyExchange from '@/hooks/useFetchCurrencyExchange';
import useHydratedDividends from '@/hooks/useHydratedDividends';
import { getDateRangeFromFileData } from '@/lib/helpers';
import { useDividendsStore } from '@/store/useDividendsStore';
import React, { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch currency exchange rates');
    }
  }, [isError]);

  if (isLoading) {
    return <div className="text-center py-10">Loading currency data...</div>;
  }

  if (!hydratedFileData || !hydratedFileData.length || isError) {
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

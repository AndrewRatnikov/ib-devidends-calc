import { Table, TableBody, TableCaption } from '@/components/ui/table';
import useDividendsSummary from '@/hooks/useDividendsSummary';
import useHydratedDividends from '@/hooks/useHydratedDividends';
import { use } from 'react';

import DividendsTableHeader from './DividendsTableHeader';
import DividendsTableRow from './DividendsTableRow';
import DividendsTableSummaryRow from './DividendsTableSummaryRow';

export default function DividendsTableContent({ promise, fileData }) {
  const currencyExchangeData = use(promise);

  const hydratedFileData = useHydratedDividends(fileData, currencyExchangeData);
  const summary = useDividendsSummary(hydratedFileData);

  if (!hydratedFileData || !hydratedFileData.length) {
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

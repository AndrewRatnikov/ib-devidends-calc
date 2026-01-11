import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * TickerSummaryTable displays a summary of dividends grouped by ticker.
 *
 * @param {Object} props - Component props
 * @param {Array<{ticker: string, gross: number, percent: number, count: number}>} props.data - Summary data by ticker
 */
export default function TickerSummaryTable({ data = [] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dividend Summary by Ticker</CardTitle>
          <CardDescription>
            Overview of dividend income per stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalGross = data.reduce((sum, item) => sum + item.gross, 0);
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend Summary by Ticker</CardTitle>
        <CardDescription>Overview of dividend income per stock</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Gross ($)</TableHead>
              <TableHead className="text-right">% of Total</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.ticker}>
                <TableCell className="font-medium">{item.ticker}</TableCell>
                <TableCell className="text-right">
                  ${item.gross.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {item.percent.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">{item.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">
                ${totalGross.toFixed(2)}
              </TableCell>
              <TableCell className="text-right font-bold">100%</TableCell>
              <TableCell className="text-right font-bold">{totalCount}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

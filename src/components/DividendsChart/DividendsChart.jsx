import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import MonthlyBarChart from './MonthlyBarChart';

/**
 * DividendsChart component displays a monthly bar chart of dividend income.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of monthly dividend data with {month, total} structure
 */
export default function DividendsChart({ data = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Dividend Income</CardTitle>
        <CardDescription>Dividend income by month (USD)</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <MonthlyBarChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}

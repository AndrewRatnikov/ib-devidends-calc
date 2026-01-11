import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import MonthlyBarChart from './MonthlyBarChart';
import TickerDonutChart from './TickerDonutChart';

export default function DividendsChart({ data = [], tickerData = [] }) {
  const hasMonthlyData = data.length > 0;
  const hasTickerData = tickerData.length > 0;
  const hasAnyData = hasMonthlyData || hasTickerData;

  if (!hasAnyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dividend Income Analysis</CardTitle>
          <CardDescription>Visualize your dividend income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividend Income Analysis</CardTitle>
        <CardDescription>Visualize your dividend income</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Responsive: column on mobile, row on md+ screens */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Monthly Bar Chart */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium mb-2">By Month</h3>
            {hasMonthlyData ? (
              <MonthlyBarChart data={data} />
            ) : (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                No monthly data
              </div>
            )}
          </div>

          {/* Ticker Donut Chart */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium mb-2">By Ticker</h3>
            {hasTickerData ? (
              <TickerDonutChart data={tickerData} />
            ) : (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                No ticker data
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

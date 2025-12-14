import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const config = {
  total: {
    label: 'Total',
    color: 'var(--chart-1)',
  },
};

export default function MonthlyBarChart({ data }) {
  // Format month for display (e.g., "2023-01" -> "Jan 2023")
  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <ChartContainer config={config} className="h-[350px] w-full">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          className="text-xs"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          className="text-xs"
        />
        <ChartTooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          content={<ChartTooltipContent labelFormatter={formatMonth} />}
        />
        <Bar
          dataKey="total"
          fill="var(--chart-1)"
          radius={[8, 8, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ChartContainer>
  );
}

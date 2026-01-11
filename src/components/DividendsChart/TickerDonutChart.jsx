import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

// Color palette for donut slices (10 colors for Top 9 + Other)
const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
  'var(--chart-9)',
  'var(--chart-10)',
];

export default function TickerDonutChart({ data }) {
  // Calculate total for center label
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.gross, 0),
    [data],
  );

  // Generate config for chart colors dynamically
  const config = useMemo(
    () =>
      data.reduce((acc, item, index) => {
        acc[item.ticker] = {
          label: item.ticker,
          color: COLORS[index % COLORS.length],
        };
        return acc;
      }, {}),
    [data],
  );

  return (
    <ChartContainer config={config} className="h-[350px] w-full">
      <PieChart>
        <Pie
          data={data}
          dataKey="gross"
          nameKey="ticker"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          {/* Center label showing total */}
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy - 10}
                      className="fill-foreground text-2xl font-bold"
                    >
                      $
                      {total.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 14}
                      className="fill-muted-foreground text-sm"
                    >
                      Total Gross
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="ticker"
              formatter={(value, name) => `${name} $${value.toFixed(2)}`}
              hideLabel
            />
          }
        />
        <ChartLegend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          content={<ChartLegendContent />}
        />
      </PieChart>
    </ChartContainer>
  );
}

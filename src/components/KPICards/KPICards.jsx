import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

/**
 * KPICards component displays key performance indicators for dividend data.
 * Shows Total Gross, Tax Withheld, Net Income, and Top Payer.
 *
 * @param {Object} props - Component props
 * @param {Object} props.metrics - KPI metrics object containing totalGross, taxWithheld, netIncome, topPayer
 */
export default function KPICards({ metrics }) {
  const { totalGross, taxWithheld, netIncome, topPayer } = metrics || {
    totalGross: 0,
    taxWithheld: 0,
    netIncome: 0,
    topPayer: 'N/A',
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const kpiData = [
    {
      title: 'Total Gross',
      value: formatCurrency(totalGross),
      description: 'Total dividend income',
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Tax Withheld',
      value: formatCurrency(taxWithheld),
      description: 'Total tax deducted',
      icon: DollarSign,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
    },
    {
      title: 'Net Income',
      value: formatCurrency(netIncome),
      description: 'After-tax dividend income',
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Top Payer',
      value: topPayer,
      description: 'Highest dividend contributor',
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`rounded-full p-2 ${kpi.iconBg}`}>
                <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <CardDescription className="text-xs">
                {kpi.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

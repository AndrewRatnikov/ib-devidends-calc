import DividendsChart from '@/components/DividendsChart';
import DividendsTable from '@/components/DividendsTable/DividendsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Table } from 'lucide-react';

/**
 * DashboardTabs component provides tab-based navigation between visual charts and data table.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} props.chartData - Monthly dividend data for the chart
 */
export default function DashboardTabs({ chartData }) {
  return (
    <Tabs defaultValue="visuals" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="visuals" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Visuals
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-2">
          <Table className="h-4 w-4" />
          Data Grid
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visuals" className="space-y-4">
        <DividendsChart data={chartData} />
      </TabsContent>

      <TabsContent value="data">
        <DividendsTable />
      </TabsContent>
    </Tabs>
  );
}

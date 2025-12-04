import { DividendsTable } from '@/components/DividendsTable';
import { LoadFileForm } from '@/components/LoadFileForm';
import React from 'react';

export default function DashboardLayout() {
  return (
    <>
      <div>
        <h1 className="text-5xl text-center pt-8 pb-8">
          Tax Dividend visualizer
        </h1>

        <div className="flex items-center justify-center">
          <LoadFileForm />
        </div>
      </div>

      <DividendsTable />
    </>
  );
}

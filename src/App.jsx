import { DividendsTable } from '@/components/DividendsTable';
import { LoadFileForm } from '@/components/LoadFileForm';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';

export default function App() {
  return (
    <main>
      <div>
        <h1 className="text-5xl text-center pt-8 pb-8">
          Tax Dividend visualizer
        </h1>
      </div>

      <LoadFileForm />

      <DividendsTable />
      <Toaster />
    </main>
  );
}

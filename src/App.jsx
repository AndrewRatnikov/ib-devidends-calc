import { Toaster } from '@/components/ui/sonner';
import { DashboardLayout } from '@/pages/DashboardLayout';
import React from 'react';

export default function App() {
  return (
    <main>
      <DashboardLayout />
      <Toaster />
    </main>
  );
}

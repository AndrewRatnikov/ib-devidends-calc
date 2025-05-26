import { Input } from '@/src/components/ui/input';

import LoadFileForm from './components/LoadFileForm';

function App() {
  return (
    <main>
      <div>
        <h1 className="text-5xl text-center pt-8 pb-8">
          Tax Dividend calculator
        </h1>

        <p className="text-center">Description</p>
      </div>

      <LoadFileForm />
    </main>
  );
}

export default App;

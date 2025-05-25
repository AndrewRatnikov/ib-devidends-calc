import { Input } from '@/src/components/ui/input';

function App() {
  return (
    <main>
      <div>
        <h1 className="text-5xl text-center">Tax Dividend calculator</h1>

        <p className="text-center">Description</p>
      </div>

      <div>
        <form>
          <Input type="file" />
        </form>
      </div>
    </main>
  );
}

export default App;

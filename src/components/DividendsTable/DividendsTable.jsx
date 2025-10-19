import { useDividendsStore } from '@/src/store/useDividendsStore';

export default function DividendsTable() {
  const fileData = useDividendsStore((s) => s.fileData);

  console.log('DividendsTable fileData: ', fileData);

  if (!fileData || !fileData.length) {
    return null;
  }

  return <>TODO: table</>;
}

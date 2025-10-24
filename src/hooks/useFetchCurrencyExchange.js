import fetchCurrencyExchange from '@/api/fetchCurrencyExchange';
import { useEffect, useState } from 'react';

export const useFetchCurrencyExchange = ({ fromDate, toDate, currency }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const result = await fetchCurrencyExchange(fromDate, toDate, currency);
        setData(result);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate, currency]);

  return { data, isLoading, isError };
};

export default useFetchCurrencyExchange;

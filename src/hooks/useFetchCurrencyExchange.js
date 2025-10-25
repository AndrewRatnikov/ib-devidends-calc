import fetchCurrencyExchange from '@/api/fetchCurrencyExchange';
import { useEffect, useState } from 'react';

export const useFetchCurrencyExchange = ({ startDate, endDate, currency }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) {
        return;
      }

      try {
        setIsLoading(true);
        setIsError(false);

        const result = await fetchCurrencyExchange(
          startDate,
          endDate,
          currency,
        );
        setData(result);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, currency]);

  return { data, isLoading, isError };
};

export default useFetchCurrencyExchange;

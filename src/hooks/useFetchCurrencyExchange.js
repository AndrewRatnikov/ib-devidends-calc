import fetchCurrencyExchange from '@/api/fetchCurrencyExchange';
import { useMemo } from 'react';

/**
 * Custom hook to fetch currency exchange data based on date range and currency.
 * Data object structure:
 * {
 *   "exchangedate": "26.12.2024",
 *   "r030": 840,
 *   "cc": "USD",
 *   "txt": "Долар США",
 *   "enname": "US Dollar",
 *   "rate": 41.8623,
 *   "units": 1,
 *   "rate_per_unit": 41.8623,
 *   "group": "1",
 *   "calcdate": "25.12.2024"
 * }
 *
 * @param {Object} params - The parameters for fetching currency exchange data.
 * @param {string} params.startDate - The start date for the exchange rate data.
 * @param {string} params.endDate - The end date for the exchange rate data.
 * @param {string} [params.currency='USD'] - The currency code to fetch exchange rates for.
 * @returns {Object} An object containing the fetched data, loading state, and error state.
 */
export const useFetchCurrencyExchange = ({ startDate, endDate, currency }) => {
  const promise = useMemo(() => {
    if (!startDate || !endDate) {
      return Promise.resolve(null);
    }

    return fetchCurrencyExchange(startDate, endDate, currency);
  }, [startDate, endDate, currency]);

  return promise;
};

export default useFetchCurrencyExchange;

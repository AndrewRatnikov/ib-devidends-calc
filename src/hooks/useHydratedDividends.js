import { useMemo } from 'react';
import dayjs from 'dayjs';

/**
 * A custom hook to hydrate dividend data with currency exchange rates.
 * @param {Array} fileData - The array of dividend data.
 * @param {Array} currencyExchangeData - The array of currency exchange rate data.
 * @returns {Array} The hydrated dividend data with an added 'curExchange' field.
 */
export const useHydratedDividends = (fileData, currencyExchangeData) => {
  const exchangeRatesByDate = useMemo(() => {
    if (!currencyExchangeData) {
      return new Map();
    }
    return currencyExchangeData.reduce((acc, item) => {
      const date = dayjs(item.exchangedate, 'DD.MM.YYYY').format('YYYY-MM-DD');
      acc.set(date, item.rate);
      return acc;
    }, new Map());
  }, [currencyExchangeData]);

  const hydratedFileData = useMemo(() => {
    if (!fileData || !exchangeRatesByDate.size) {
      return fileData; // Return original data if no exchange rates
    }
    return fileData.map((item) => {
      const date = dayjs(item.date.substring(0, 8), 'YYYYMMDD').format(
        'YYYY-MM-DD',
      );
      // Default to 1 if no exchange rate is found for the given date.
      const exchangeRate = exchangeRatesByDate.get(date) || 1;
      return { ...item, curExchange: exchangeRate };
    });
  }, [fileData, exchangeRatesByDate]);

  return hydratedFileData;
};

export default useHydratedDividends;

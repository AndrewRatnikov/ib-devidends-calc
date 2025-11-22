import { describe, expect, it } from 'vitest';

import { getDateRangeFromFileData } from './helpers';

describe('getDateRangeFromFileData', () => {
  it('should return null for empty or null input', () => {
    expect(getDateRangeFromFileData(null)).toBeNull();
    expect(getDateRangeFromFileData([])).toBeNull();
  });

  it('should return correct start and end dates', () => {
    const fileData = [
      { date: '2023-01-15' },
      { date: '2023-06-20' },
      { date: '2023-03-10' },
    ];

    const result = getDateRangeFromFileData(fileData);

    expect(result).toEqual({
      startDate: '20230115',
      endDate: '20230620',
    });
  });

  it('should handle single date', () => {
    const fileData = [{ date: '2023-01-15' }];
    const result = getDateRangeFromFileData(fileData);
    expect(result).toEqual({
      startDate: '20230115',
      endDate: '20230115',
    });
  });
});

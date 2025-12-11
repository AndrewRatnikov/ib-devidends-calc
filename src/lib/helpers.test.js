import { describe, expect, it } from 'vitest';

import {
  calculateKPIMetrics,
  convertOfxToJson,
  extractDividendsFromJson,
  getDateRangeFromFileData,
  groupDividendsByMonth,
  xmlToJson,
} from './helpers';

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

describe('convertOfxToJson', () => {
  it('should convert valid OFX content to JSON', () => {
    const ofxContent = `
      <OFX>
        <SIGNONMSGSRSV1>
          <SONRS>
            <STATUS>
              <CODE>0</CODE>
              <SEVERITY>INFO</SEVERITY>
            </STATUS>
          </SONRS>
        </SIGNONMSGSRSV1>
      </OFX>
    `;
    const json = convertOfxToJson(ofxContent);
    expect(json).toBeDefined();
    expect(json.OFX.SIGNONMSGSRSV1.SONRS.STATUS.CODE).toBe('0');
  });

  it('should handle malformed OFX gracefully or throw error', () => {
    // The current implementation throws an error if parser fails or no OFX tag found
    const invalidContent = 'INVALID CONTENT';
    // Depending on implementation, it might return undefined or throw
    // Based on code: if no <OFX> match, it returns undefined implicitly
    expect(convertOfxToJson(invalidContent)).toBeUndefined();
  });

  it('should clean up tags correctly', () => {
    const ofxContent = `
      <OFX>
        <CODE>0</CODE>
      </OFX>
    `;
    const json = convertOfxToJson(ofxContent);
    expect(json.OFX.CODE).toBe('0');
  });
});

describe('xmlToJson', () => {
  it('should convert simple XML node to object', () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      '<ROOT><CHILD>Value</CHILD></ROOT>',
      'text/xml',
    );
    const json = xmlToJson(xmlDoc.documentElement);
    expect(json).toEqual({ CHILD: 'Value' });
  });

  it('should convert nested XML to object', () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      '<ROOT><PARENT><CHILD>Value</CHILD></PARENT></ROOT>',
      'text/xml',
    );
    const json = xmlToJson(xmlDoc.documentElement);
    expect(json).toEqual({ PARENT: { CHILD: 'Value' } });
  });

  it('should handle attributes', () => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(
      '<ROOT attr="value">Text</ROOT>',
      'text/xml',
    );
    const json = xmlToJson(xmlDoc.documentElement);
    expect(json).toEqual({ '@attributes': { attr: 'value' }, '#text': 'Text' });
  });
});

describe('extractDividendsFromJson', () => {
  it('should extract dividends correctly', () => {
    const mockJson = {
      OFX: {
        INVSTMTMSGSRSV1: {
          INVSTMTTRNRS: {
            INVSTMTRS: {
              INVTRANLIST: {
                INVBANKTRAN: [
                  {
                    STMTTRN: {
                      MEMO: 'AAPL(US0378331005) Cash Dividend USD 0.24 - US TAX',
                      TRNAMT: '-3.60',
                    },
                  },
                ],
                INCOME: [
                  {
                    INCOMETYPE: 'DIV',
                    INVTRAN: {
                      MEMO: 'AAPL(US0378331005) Cash Dividend USD 0.24 per Share (Ordinary Dividend)',
                      DTTRADE: '20230216120000',
                      FITID: '12345',
                    },
                    TOTAL: '24.00',
                    CURRENCY: { CURSYM: 'USD' },
                  },
                ],
              },
            },
          },
        },
      },
    };

    const dividends = extractDividendsFromJson(mockJson);

    expect(dividends).toHaveLength(1);
    expect(dividends[0]).toEqual({
      id: '12345',
      date: '2023-02-16',
      ticker: 'AAPL',
      description:
        'AAPL(US0378331005) Cash Dividend USD 0.24 per Share (Ordinary Dividend)',
      dividendPerShare: 0.24,
      total: 24.0,
      currencySymbol: 'USD',
      tax: -3.6,
    });
  });

  it('should handle missing tax data', () => {
    const mockJson = {
      OFX: {
        INVSTMTMSGSRSV1: {
          INVSTMTTRNRS: {
            INVSTMTRS: {
              INVTRANLIST: {
                INVBANKTRAN: [], // No tax transactions
                INCOME: [
                  {
                    INCOMETYPE: 'DIV',
                    INVTRAN: {
                      MEMO: 'MSFT(US5949181045) Cash Dividend USD 0.68 per Share (Ordinary Dividend)',
                      DTTRADE: '20230310120000',
                      FITID: '67890',
                    },
                    TOTAL: '68.00',
                    CURRENCY: { CURSYM: 'USD' },
                  },
                ],
              },
            },
          },
        },
      },
    };

    const dividends = extractDividendsFromJson(mockJson);
    expect(dividends).toHaveLength(1);
    expect(dividends[0].tax).toBe(0);
  });
});

describe('calculateKPIMetrics', () => {
  it('should return zero values for empty or null input', () => {
    expect(calculateKPIMetrics(null)).toEqual({
      totalGross: 0,
      taxWithheld: 0,
      netIncome: 0,
      topPayer: 'N/A',
    });
    expect(calculateKPIMetrics([])).toEqual({
      totalGross: 0,
      taxWithheld: 0,
      netIncome: 0,
      topPayer: 'N/A',
    });
  });

  it('should calculate correct KPI metrics', () => {
    const fileData = [
      { ticker: 'AAPL', total: 100, tax: -15 },
      { ticker: 'MSFT', total: 200, tax: -30 },
      { ticker: 'AAPL', total: 50, tax: -7.5 },
    ];

    const result = calculateKPIMetrics(fileData);

    expect(result.totalGross).toBe(350);
    expect(result.taxWithheld).toBe(52.5);
    expect(result.netIncome).toBe(297.5);
    expect(result.topPayer).toBe('MSFT');
  });

  it('should handle missing tax values', () => {
    const fileData = [
      { ticker: 'AAPL', total: 100 },
      { ticker: 'MSFT', total: 200 },
    ];

    const result = calculateKPIMetrics(fileData);

    expect(result.totalGross).toBe(300);
    expect(result.taxWithheld).toBe(0);
    expect(result.netIncome).toBe(300);
  });

  it('should find top payer correctly with equal amounts', () => {
    const fileData = [
      { ticker: 'AAPL', total: 100, tax: -15 },
      { ticker: 'MSFT', total: 100, tax: -15 },
    ];

    const result = calculateKPIMetrics(fileData);
    // When equal, it should return one of them (whichever is first in reduce)
    expect(['AAPL', 'MSFT']).toContain(result.topPayer);
  });

  it('should handle N/A tickers', () => {
    const fileData = [
      { ticker: 'N/A', total: 100, tax: -15 },
      { ticker: 'AAPL', total: 50, tax: -7.5 },
    ];

    const result = calculateKPIMetrics(fileData);

    expect(result.topPayer).toBe('AAPL');
    expect(result.totalGross).toBe(150);
  });
});

describe('groupDividendsByMonth', () => {
  it('should return empty array for empty or null input', () => {
    expect(groupDividendsByMonth(null)).toEqual([]);
    expect(groupDividendsByMonth([])).toEqual([]);
  });

  it('should group dividends by month correctly', () => {
    const fileData = [
      { date: '2023-01-15', total: 100 },
      { date: '2023-01-20', total: 50 },
      { date: '2023-02-10', total: 200 },
      { date: '2023-02-25', total: 150 },
    ];

    const result = groupDividendsByMonth(fileData);

    expect(result).toEqual([
      { month: '2023-01', total: 150 },
      { month: '2023-02', total: 350 },
    ]);
  });

  it('should sort months chronologically', () => {
    const fileData = [
      { date: '2023-06-15', total: 100 },
      { date: '2023-01-20', total: 50 },
      { date: '2023-03-10', total: 200 },
    ];

    const result = groupDividendsByMonth(fileData);

    expect(result).toEqual([
      { month: '2023-01', total: 50 },
      { month: '2023-03', total: 200 },
      { month: '2023-06', total: 100 },
    ]);
  });

  it('should handle missing total values', () => {
    const fileData = [
      { date: '2023-01-15' },
      { date: '2023-01-20', total: 50 },
    ];

    const result = groupDividendsByMonth(fileData);

    expect(result).toEqual([{ month: '2023-01', total: 50 }]);
  });

  it('should handle missing date values', () => {
    const fileData = [
      { date: '2023-01-15', total: 100 },
      { total: 50 }, // No date
    ];

    const result = groupDividendsByMonth(fileData);

    expect(result).toEqual([{ month: '2023-01', total: 100 }]);
  });

  it('should handle single month with multiple entries', () => {
    const fileData = [
      { date: '2023-05-01', total: 10 },
      { date: '2023-05-10', total: 20 },
      { date: '2023-05-20', total: 30 },
      { date: '2023-05-31', total: 40 },
    ];

    const result = groupDividendsByMonth(fileData);

    expect(result).toEqual([{ month: '2023-05', total: 100 }]);
  });
});

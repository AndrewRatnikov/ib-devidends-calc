import { describe, expect, it } from 'vitest';

import {
  convertOfxToJson,
  extractDividendsFromJson,
  getDateRangeFromFileData,
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

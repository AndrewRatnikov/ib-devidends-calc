import dayjs from 'dayjs';

/**
 * Extracts dividend data from a parsed OFX JSON object.
 *
 * @param {Object} ofxJson The parsed JSON object representing the OFX data.
 * @returns {Array<Object>} An array of objects, each representing a dividend transaction.
 * Each object will have properties like:
 * - id: Unique transaction ID (FITID)
 * - date: Date the dividend was traded (DTTRADE)
 * - ticker: Ticker symbol of the security
 * - description: Description of the transaction (MEMO)
 * - dividendPerShare: The dividend price per one share
 * - total: Dividend amount (TOTAL)
 * - currencySymbol: Symbol of the currency (CURSYM)
 * - tax: The tax amount for the dividend
 * - numberOfShares: The number of shares.
 */
export function extractDividendsFromJson(ofxJson) {
  const dividends = [];
  const taxData = new Map();

  try {
    const invTranList =
      ofxJson?.OFX?.INVSTMTMSGSRSV1?.INVSTMTTRNRS?.INVSTMTRS?.INVTRANLIST;

    if (invTranList) {
      const invBankTrans = Array.isArray(invTranList.INVBANKTRAN)
        ? invTranList.INVBANKTRAN
        : invTranList.INVBANKTRAN
          ? [invTranList.INVBANKTRAN]
          : [];

      invBankTrans.forEach((trans) => {
        const memo = trans.STMTTRN?.MEMO;
        if (memo && memo.includes('CASH DIVIDEND') && memo.includes('US TAX')) {
          const key = memo.replace(' - US TAX', '');
          const taxAmount = parseFloat(trans.STMTTRN?.TRNAMT) || 0;
          taxData.set(key, taxAmount);
        }
      });

      const incomeData = invTranList.INCOME;
      const incomeTransactions = Array.isArray(incomeData)
        ? incomeData
        : incomeData
          ? [incomeData]
          : [];

      incomeTransactions.forEach((incomeTran) => {
        if (incomeTran.INCOMETYPE === 'DIV') {
          const description = incomeTran.INVTRAN?.MEMO || 'Dividend';
          const key = description.replace(' (Ordinary Dividend)', '');
          const tax = taxData.get(key) || 0;

          const date = incomeTran.INVTRAN?.DTTRADE || 'N/A';

          const tickerMatch = description.match(/^([A-Z]+)/);
          const ticker = tickerMatch ? tickerMatch[1] : 'N/A';

          const dividendPerShareMatch = description.match(
            /USD ([\d.]+) PER SHARE/,
          );
          const dividendPerShare = dividendPerShareMatch
            ? parseFloat(dividendPerShareMatch[1])
            : 0;

          const total = parseFloat(incomeTran.TOTAL) || 0;

          const dividend = {
            id: incomeTran.INVTRAN?.FITID || 'N/A',
            date: dayjs(date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD'),
            ticker,
            description,
            dividendPerShare,
            total,
            currencySymbol: incomeTran.CURRENCY?.CURSYM || 'N/A',
            tax,
          };
          dividends.push(dividend);
        }
      });
    }
  } catch (e) {
    console.error('Error extracting dividends from JSON:', e);
  }

  return dividends;
}

/**
 * Converts an OFX content string into a JSON object.
 * This function assumes the OFX structure is XML-like.
 *
 * @param {string} ofxContent The full content of the OFX file as a string.
 * @returns {Object} A JavaScript object representing the OFX data.
 */
export function convertOfxToJson(ofxContent) {
  const parser = new DOMParser();
  const ofxStartMatch = ofxContent.match(/<OFX>(.*)/s);

  if (ofxStartMatch) {
    let cleanedOfxContent = ofxStartMatch[0];
    cleanedOfxContent = cleanedOfxContent.replace(
      /<(\w+?)>(\s*?)<\/\1>/g,
      '<$1/>',
    );
    cleanedOfxContent = cleanedOfxContent.replace(
      /&(?!(amp;|lt;|gt;|quot;|apos;))/g,
      '&amp;',
    );

    if (!cleanedOfxContent.trim().startsWith('<OFX>')) {
      cleanedOfxContent = `<OFXRoot>${cleanedOfxContent}</OFXRoot>`;
    }

    const xmlDoc = parser.parseFromString(cleanedOfxContent, 'text/xml');

    const parserErrors = xmlDoc.getElementsByTagName('parsererror');
    if (parserErrors.length > 0) {
      const errorMessage = parserErrors[0].textContent;
      throw new Error('OFX content parsing error: ' + errorMessage);
    }

    return xmlToJson(xmlDoc);
  }
}

/**
 * Converts an XML DOM node (and its children) into a JSON object.
 * Adapted for typical OFX structure where tags often contain single text values
 * or nested tags.
 *
 * @param {Node} xml The XML DOM node to convert.
 * @returns {Object|string} The JSON representation of the XML node.
 */
export function xmlToJson(xml) {
  let obj = {};

  if (xml.nodeType === 1) {
    // Element Node
    // Handle attributes if any (OFX usually doesn't have many relevant ones)
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3 || xml.nodeType === 4) {
    // Text Node or CDATA Section
    return xml.nodeValue.trim();
  }

  // Loop through all children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;

      if (item.nodeType === 1) {
        // Child is an Element Node
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      } else if (item.nodeType === 3 || item.nodeType === 4) {
        // Child is a Text Node or CDATA
        const textContent = item.nodeValue.trim();
        if (textContent.length > 0) {
          // If the element has text content AND child elements,
          // put text content under a special key like #text
          if (Object.keys(obj).length > 0 && !obj['#text']) {
            obj['#text'] = textContent;
          } else if (Object.keys(obj).length === 0) {
            // If it's just text content, return the text directly
            return textContent;
          }
        }
      }
    }
  }

  return obj;
}

const DATE_FORMAT = 'YYYYMMDD';

/**
 * Calculates the date range from a list of dividend transactions.
 *
 * @param {Array<Object>} fileData An array of dividend objects, each with a 'date' property.
 * @returns {{startDate: string, endDate: string} | null} An object containing the start and end date, or null if no dates are found.
 */
export function getDateRangeFromFileData(fileData) {
  if (!fileData || fileData.length === 0) {
    return null;
  }

  const dates = fileData.map((item) => dayjs(item.date, DATE_FORMAT));

  const minDate = dates.reduce(
    (min, current) => (current.isBefore(min) ? current : min),
    dates[0],
  );
  const maxDate = dates.reduce(
    (max, current) => (current.isAfter(max) ? current : max),
    dates[0],
  );

  const startDate = minDate.format(DATE_FORMAT);
  const endDate = maxDate.format(DATE_FORMAT);

  return { startDate, endDate };
}

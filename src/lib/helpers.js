/**
 * Extracts dividend data from a parsed OFX JSON object.
 *
 * @param {Object} ofxJson The parsed JSON object representing the OFX data.
 * @returns {Array<Object>} An array of objects, each representing a dividend transaction.
 * Each object will have properties like:
 * - id: Unique transaction ID (FITID)
 * - date: Date the dividend was traded (DTTRADE)
 * - amount: Dividend amount (TOTAL)
 * - description: Description of the transaction (MEMO)
 * - securityId: CUSIP of the security (UNIQUEID)
 * - securityType: Type of the security ID (UNIQUEIDTYPE)
 * - incomeType: Type of income (e.g., DIV)
 * - currencySymbol: Symbol of the currency (CURSYM)
 */
export function extractDividendsFromJson(ofxJson) {
  const dividends = [];

  try {
    const invTranList =
      ofxJson?.OFX?.INVSTMTMSGSRSV1?.INVSTMTTRNRS?.INVSTMTRS?.INVTRANLIST;

    if (invTranList && invTranList.INCOME) {
      const incomeData = invTranList.INCOME;

      const incomeTransactions = Array.isArray(incomeData)
        ? incomeData
        : [incomeData];

      incomeTransactions.forEach((incomeTran) => {
        if (incomeTran.INCOMETYPE === 'DIV') {
          const dividend = {
            id: incomeTran.INVTRAN?.FITID || 'N/A',
            date: incomeTran.INVTRAN?.DTTRADE || 'N/A',
            amount: parseFloat(incomeTran.TOTAL) || 0,
            description: incomeTran.INVTRAN?.MEMO || 'Dividend',
            securityId: incomeTran.SECID?.UNIQUEID || 'N/A',
            securityType: incomeTran.SECID?.UNIQUEIDTYPE || 'N/A',
            incomeType: incomeTran.INCOMETYPE || 'N/A',
            currencySymbol: incomeTran.CURRENCY?.CURSYM || 'N/A',
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

export default async function fetchCurrencyExchange(
  fromDate,
  toDate,
  currency = 'USD',
) {
  const url = `https://bank.gov.ua/NBU_Exchange/exchange_site?start=${fromDate}&end=${toDate}&valcode=${currency}&sort=exchangedate&order=desc&json`;

  try {
    const data = await fetch(url);
    const json = await data.json();

    return json;
  } catch (error) {
    console.error('Error fetching currency exchange data:', error);
  }
}

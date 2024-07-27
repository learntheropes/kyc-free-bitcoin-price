import tor from 'tor-request';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {
  try {
    const currency = getRouterParam(event, 'currency');
    return await fetchRoboSats(currency);
  } catch (error) {
    return [];
  }
});

const fetchRoboSats = (currency) => {

  const currencies = getCurrencies();
  const currencyIndex = currencies[currency];

  return new Promise((resolve, reject) => {
    return tor.request(`http://satstraoq35jffvkgpfoqld32nzw2siuvowanruindbfojowpwsjdgad.onion/api/book/?format=json&currency=${currencyIndex}&type=1`, function (error, res, body) {
      
      if (error) {
        console.log('robosats sell api error', error);
        reject({ data: [], error: 'robosats sell' });
      }

      if (!JSON.parse(body)['not_found']) {
        const methods = groupBy(JSON.parse(body), 'payment_method');
  
        const data = Object.keys(methods).reduce((arr, method) => {
          const offer = parseFloat(minBy(methods[method], 'price').price);
          const fee = (parseFloat(minBy(methods[method], 'price').price) * 0.175 / 100);
      
          method
            .split(' ')
            .filter(m => m !== '&' && m !== 'Friends' && m !== 'Family' && m !== 'Monero' && m !== 'USDT' && m !== 'L-USDt' && m !== 'IT' && m !== 'it' && m !== 'It')
            .forEach(normilizedMethod => {
              arr.push({
                service: 'RoboSats',
                url: 'https://unsafe.robosats.com/',
                features: ['lightning', 'p2p', 'open-source'],
                method: capitalize(normilizedMethod).replace('Instant', 'Sepa Instant'),
                price: parseFloat(offer + fee)
              });
            })
          
          return arr;
        }, []);
  
        resolve({ data });
      }
      else {
        reject({ data: [], error: 'robosats sell' });
      }
    });
  });
};
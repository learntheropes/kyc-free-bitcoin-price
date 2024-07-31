import tor from 'tor-request';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {
  const currency = getRouterParam(event, 'currency');

  return new Promise((resolve, reject) => {
    tor.request(`http://runbtcxzz4v2haszypwbrn2baqdo7tlwt6dw7g27cwwaootd4gktwayd.onion/api/offers?market=BTC_${currency}`, function (error, res, body) {
      if (error) {
        console.log('bisq buy api error', error);
        reject({ data: [], error: 'bisq buy' });
        return;
      }

      const offers = JSON.parse(body);
      const sells = offers[`btc_${currency.toLowerCase()}`].sells;

      const methods = groupBy(sells, 'payment_method');
      const data = Object.keys(methods).reduce((arr, method) => {
        const offer = parseFloat(minBy(methods[method], 'price').price);
        const fee = (parseFloat(minBy(methods[method], 'price').price) * 1.15 / 100);

        arr.push({
          service: 'Bisq',
          site: 'https://bisq.network/',
          features: ['on-chain', 'p2p', 'open-source'],
          method: capitalize(method.split('_').join(' ')).replace('F2f', 'In Person'),
          price: parseFloat(offer + fee)
        });

        return arr;
      }, []);

      resolve({ data });
    });
  });
});
import { ofetch } from 'ofetch';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {

  const { 
    btc_eur: { 
      sells 
    }
  } = await ofetch('https://bisq.markets/api/offers?market=BTC_EUR');

  const methods = groupBy(sells, 'payment_method');

  return Object.keys(methods).reduce((arr, method) => {
    const offer = parseFloat(minBy(methods[method], 'price').price).toFixed(2);
    const fee = (parseFloat(minBy(methods[method], 'price').price) * 1.15 / 100).toFixed(2);

    arr.push({
      service: 'Bisq',
      site: 'https://bisq.network/',
      features: ['on-chain', 'p2p'],
      method: capitalize(method.split('_').join(' ')),
      price: parseFloat(offer + fee).toFixed(2)
    });

    return arr;
  }, []);
})
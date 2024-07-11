import { ofetch } from 'ofetch';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');

    const offers = await ofetch(`https://bisq.markets/api/offers?market=BTC_${currency}`);
    const sells = offers[`btc_${currency.toLowerCase()}`].sells

    const methods = groupBy(sells, 'payment_method');
  
    return Object.keys(methods).reduce((arr, method) => {
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
  } catch (error) {
    console.log('bisq api error', error);
    return [];
  }
})
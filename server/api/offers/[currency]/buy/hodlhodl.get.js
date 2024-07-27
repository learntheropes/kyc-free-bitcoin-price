import { ofetch } from 'ofetch';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    const { offers } = await ofetch(`https://hodlhodl.com/api/v1/offers?filters[currency_code]=${currency}&filters[side]=BUY&pagination[limit]=100`);

    let allMethods = [];
    
    offers.map(offer => {
  
      const offerAllMethods = offer.payment_methods
        .filter(method => method.type !== 'Cryptocurrency')
        .reduce((arr, method) => {
          arr.push({
            service: 'HodlHodl',
            url: 'https://hodlhodl.com/join/HCJ6',
            features: ['on-chain', 'p2p'],
            method: capitalize(method.name)
              .replace('(EU)', '')
              .replace('Sepa  Bank Transfer', 'Sepa')
              .replace('Payconiq By Bancontact', 'Payconiq')
              .replace('Mastercard Para Ti Plus', 'Mastercard Para Ti')
              .replace('Sabadell Instant Money', 'Sabadell Instant'),
            price: parseFloat(parseFloat(offer.price) * (1 - parseFloat(offer.fee.author_fee_rate) - parseFloat(offer.fee.intermediary_fee_rate)))
          })
          return arr;
        }, []);
  
      allMethods = [
        ...allMethods,
        ...offerAllMethods
      ]
    });
  
    const methods = groupBy(allMethods, 'method');
  
    const data = Object.keys(methods).reduce((arr, method) => {
      arr.push(minBy(methods[method], 'price'))
      return arr;
    }, []);

    return { data };
  } catch (error) {
    console.log('hodl hodl buy api error', error);
    return { error: 'hodl hodl buy', data: [] };
  }
})
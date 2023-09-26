import { ofetch } from 'ofetch';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {
  const { offers } = await ofetch('https://hodlhodl.com/api/v1/offers?filters[currency_code]=EUR&filters[side]=SELL&pagination[limit]=100');

  let allMethods = [];
  
  offers.map(offer => {

    const offerAllMethods = offer.payment_method_instructions
      .filter(method => method.payment_method_type !== 'Cryptocurrency')
      .reduce((arr, method) => {
        arr.push({
          service: 'Hodl Hodl',
          url: 'https://hodlhodl.com',
          features: ['on-chain', 'p2p'],
          method: capitalize(method.payment_method_name).replace('(eu)', '').replace('Sepa Bank Transfer', 'Sepa'),
          price: parseFloat(parseFloat(offer.price) * (1 + parseFloat(offer.fee.author_fee_rate) + parseFloat(offer.fee.intermediary_fee_rate))).toFixed(2)
        })
        return arr;
      }, []);

    allMethods = [
      ...allMethods,
      ...offerAllMethods
    ]
  });

  const methods = groupBy(allMethods, 'method');

  return Object.keys(methods).reduce((arr, method) => {
    arr.push(minBy(methods[method], 'price'))
    return arr;
  }, []);
})
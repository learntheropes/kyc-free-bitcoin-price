import { ofetch } from 'ofetch';
import groupBy from 'lodash.groupby';
import maxBy from 'lodash.maxby';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');

    const { offers } = await ofetch(`https://hodlhodl.com/api/v1/offers?filters[currency_code]=${currency}&filters[side]=SELL&pagination[limit]=100`);

    let allMethods = [];
    
    offers.map(offer => {
  
      const offerAllMethods = offer.payment_method_instructions
        .filter(method => method.payment_method_type !== 'Cryptocurrency')
        .reduce((arr, method) => {
          arr.push({
            service: 'HodlHodl',
            url: 'https://hodlhodl.com/join/HCJ6',
            features: ['on-chain', 'p2p'],
            method: capitalize(method.payment_method_name)
              .replace('(eu)', '')
              .replace('Sepa  Bank Transfer', 'Sepa')
              .replace('Payconiq By Bancontact', 'Payconiq'),
            price: parseFloat(parseFloat(offer.price) * (1 + parseFloat(offer.fee.author_fee_rate) + parseFloat(offer.fee.intermediary_fee_rate)))
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
      arr.push(maxBy(methods[method], 'price'))
      return arr;
    }, []);
    return { data };
  } catch (error) {
    console.log('hodlhodl sell api error', error);
    return { error: 'hodlhodl', data: [] };
  }
})
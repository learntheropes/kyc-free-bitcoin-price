import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    if (currency !== 'EUR' && currency !== 'CHF') return [];

    const response = await ofetch(`https://exchange.api.bity.com/v2/orders/estimate`, {
      method: 'POST',
      body: {
        output: {
            amount: '1.00000000',
            currency: 'BTC'
        },
        input: {
            currency
        }
      }
    });
  
    const { 
      input: { 
        amount: basePrice
      }, 
      price_breakdown: { 
        customer_trading_fee: { 
          amount: tradingFee
        }, 
        'non-verified_fee': { 
          amount: nonVerifiedFee
        }
      }
    } = response;
  
    const price =  parseFloat(parseFloat(basePrice) + parseFloat(tradingFee) + parseFloat(nonVerifiedFee));
  
    return [
      {
        service: 'Bity',
        url: 'https://bity.com/',
        features: ['on-chain'],
        method: 'Sepa Instant',
        price
      },
      {
        service: 'Bity',
        features: ['on-chain'],
        method: 'Sepa',
        price
      }
    ]
  } catch (error) {
    console.log('bity api error', error);
    return [];
  }
});
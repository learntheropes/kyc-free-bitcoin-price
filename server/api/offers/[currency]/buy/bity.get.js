import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    if (currency !== 'EUR' && currency !== 'CHF') return { data: [] };

    const response = await ofetch(`https://exchange.api.bity.com/v2/orders/estimate`, {
      method: 'POST',
      body: {
        input: {
            currency: 'BTC',
            amount: '1',

        },
        output: {
            currency,

        }
      }
    });
  
    const { 
      output: { 
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
  
    const price =  parseFloat(parseFloat(basePrice) - parseFloat(tradingFee) - parseFloat(nonVerifiedFee));
  
    const data = [
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
    return { data };
  } catch (error) {
    console.log('bity buy api error', error);
    return { error: 'bity', data: [] };
  }
});
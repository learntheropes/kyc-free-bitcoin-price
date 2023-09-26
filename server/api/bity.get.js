import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  const response = await ofetch(`https://exchange.api.bity.com/v2/orders/estimate`, {
    method: 'POST',
    body: {
      output: {
          amount: '1.00000000',
          currency: 'BTC'
      },
      input: {
          currency: 'EUR'
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

  const price =  parseFloat(parseFloat(basePrice) + parseFloat(tradingFee) + parseFloat(nonVerifiedFee)).toFixed(2);

  return [
    {
      service: 'Bity',
      method: 'SEPA_INSTANT',
      price
    },
    {
      service: 'Bity',
      method: 'SEPA',
      price
    }
  ]
});
import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const response = await ofetch(`https://api.kraken.com/0/public/Ticker?pair=XBTEUR`);
  
    const { 
      result: { 
        XXBTZEUR: {
          a: [
            exchangePrice
          ]
        }
      }
    } = response;
  
    const price =  parseFloat(exchangePrice).toFixed(2);
  
    return [
      {
        service: 'VoucherBot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Sepa Instant',
        price
      },
      {
        service: 'VoucherBot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Sepa',
        price
      },
      {
        service: 'VoucherBot',
        url: 'https://t.me/BitcoinVoucherBot',
        features: ['lightning'],
        method: 'Voucher',
        price: parseFloat(price * 1.05).toFixed(2)
      }
    ]
  } catch (error) {
    console.log('kraken api error', error);
    return [];
  }
});
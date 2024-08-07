import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    if (currency !== 'EUR' && currency !== 'CHF') return { data: [] };

    const response = await ofetch(`https://api.kraken.com/0/public/Ticker?pair=XBT${currency}`);
    const { 
      result: { 
        XXBTZEUR: {
          a: [
            exchangePrice
          ]
        }
      }
    } = response;
  
    const price =  parseFloat(exchangePrice);
  
    const data = [
      {
        service: 'VoucherBot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Sepa Instant',
        price: parseFloat(price * 1.025)
      },
      {
        service: 'VoucherBot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Sepa',
        price: parseFloat(price * 1.025)
      },
      {
        service: 'VoucherBot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Voucher',
        price: parseFloat(price * 1.05)
      }
    ]
    return { data };
  } catch (error) {
    console.log('voucherbot sell api error', error);
    return { error: 'voucherbot', data: [] };
  }
});

import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    if (currency !== 'EUR') return { data: [] };

    const { 
      result: { 
        XXBTZEUR: {
          a: [
            exchangePrice
          ]
        }
      }
    } = await ofetch(`https://api.kraken.com/0/public/Ticker?pair=XBT${currency}`);
  
    const price =  parseFloat(exchangePrice);
  
    const data = [
      {
        service: 'Voucher Bot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Sepa Instant',
        price: parseFloat(price * 1.025)
      },
      {
        service: 'Voucher Bot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Sepa',
        price: parseFloat(price * 1.025)
      },
      {
        service: 'Voucher Bot',
        url: 'https://t.me/BitcoinVoucherBot?start=345173833',
        features: ['on-chain', 'lightning'],
        method: 'Voucher',
        price: parseFloat(price * 1.05)
      }
    ]
    return { data };
  } catch (error) {
    console.log('voucherbot sell api error', error);
    return { error: 'voucher bot', data: [] };
  }
});

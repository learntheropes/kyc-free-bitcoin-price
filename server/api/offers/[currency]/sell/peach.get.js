import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    
    const { price: basePrice } = await ofetch(`https://api.peachbitcoin.com/v1/market/price/BTC${currency}`);

    const { offers } = await ofetch(`https://api.peachbitcoin.com/v1/offer/search?sortBy=lowestPremium&size=50`, {
      method: 'POST',
      body: {
        type: "ask"
      }
    });

    let data = [];

    offers.forEach(offer => {
      if (offer.meansOfPayment[currency]) {
        offer.meansOfPayment[currency].forEach(method => {
          data.push({
            service: 'Peach Bitcoin',
            url: 'https://peachbitcoin.com/referral?code=PR41CA',
            features: [
              'on-chain',
              'p2p'
            ],
            method: (method.startsWith('cash.')) ? 'Cash' : capitalize(method),
            price: (basePrice * (offer.premium/100 + 1) * 1.02)
          });
        })
      }
    });

    return { data };
  } catch (error) {
    console.log('peachbitcoin sell api error', error);
    return { error: 'peachbitcoin sell', data: [] };
  }
});
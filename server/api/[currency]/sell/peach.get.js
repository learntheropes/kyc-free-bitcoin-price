import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');
    const { price: basePrice } = await ofetch(`https://api.peachbitcoin.com/v1/market/price/BTC${currency}`);
    const response = await ofetch(`https://api.peachbitcoin.com/v1/offer/search?sortBy=lowestPremium&size=50`, {
      method: 'POST',
      body: {
        type: "ask"
      }
    });

    const { offers } = response;

    let results = [];

    offers.forEach(offer => {
      if (offer.meansOfPayment[currency]) {
        return offer.meansOfPayment[currency].forEach(method => {
          results.push({
            service: 'Peach Bitcoin',
            url: 'https://peachbitcoin.com',
            features: [
              'on-chain',
              'p2p'
            ],
            method: (method.startsWith('cash.')) ? 'Cash' : capitalize(method),
            price: (basePrice * (offer.premium/100 + 1) * 1.02).toFixed(2)
          });
        })
      }
    });

    return results;
  } catch (error) {
    console.log('peach api error', error);
    return [];
  }
});
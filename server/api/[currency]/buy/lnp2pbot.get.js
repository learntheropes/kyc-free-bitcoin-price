import { ofetch } from 'ofetch';

export default defineEventHandler(async event => {

  try {
    const currency = getRouterParam(event, 'currency');

    const yado = await ofetch(`https://api.yadio.io/exrates/${currency}`);
    const basePrice = yado.BTC;

    const book = await ofetch(`https://api.lnp2pbot.com/orders`);
    const offers = book.filter(offer => offer.type === 'buy' && offer.fiat_code === currency)
  
    return offers.map(offer => {
      return {
        service: 'Lnp2pbot',
        site: 'https://lnp2pbot.com/',
        features: ['lightning', 'p2p', 'open-source'],
        method: offer.payment_method.substring(0, 14).replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''),
        price: (basePrice * ( 1 - (offer.price_margin/100) - (offer.bot_fee/100) - (offer.community_fee/100))).toFixed(2)
      }
    })
  } catch (error) {
    console.log('bisq api error', error);
    return [];
  }
})
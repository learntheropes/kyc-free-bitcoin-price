import sortBy from 'lodash.sortby';
import { testValidCurrency } from '~/server/utils/testValidCurrency'

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency');

    const isSupportedCurrency = await testValidCurrency(event, currency)
    if (!isSupportedCurrency) {
      setResponseStatus(event, 404)
      return { error: { statusCode: 404 } }
    }

    const bisqFetch = $fetch(`/api/offers/${currency}/sell/bisq`);
    // const bityFetch = $fetch(`/api/offers/${currency}/sell/bity`);
    const hodlHodlFetch = $fetch(`/api/offers/${currency}/sell/hodlhodl`);
    const roboSatsFetch = $fetch(`/api/offers/${currency}/sell/robosats`);
    const voucherBotFetch = $fetch(`/api/offers/${currency}/sell/voucherbot`);
    const peachFetch = $fetch(`/api/offers/${currency}/sell/peach`);
    // const lnp2pbotFetch = $fetch(`/api/offers/${currency}/sell/lnp2pbot`);

    const promises = [
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      voucherBotFetch,
      peachFetch
    ];

    const [
      bisq,
      hodlHodl,
      roboSats,
      voucherBot,
      peach
    ] = await Promise.all(promises);

    const data = sortBy([
      ...bisq.data,
      ...hodlHodl.data,
      ...roboSats.data,
      ...voucherBot.data,
      ...peach.data
    ], 'price');

    const errors = [
      bisq.error,
      hodlHodl.error,
      roboSats.error,
      voucherBot.error,
      peach.error
    ].filter(error => error !== undefined);

    return { data, errors };
  } catch (error) {
    console.log('sell offers api error', error);
    setResponseStatus(event, 500);
    return { error: true, data: false };
  }
});

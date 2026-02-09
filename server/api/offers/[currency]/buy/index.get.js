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

    const bisqFetch = $fetch(`/api/offers/${currency}/buy/bisq`);
    // const bityFetch = $fetch(`/api/offers/${currency}/buy/bity`);
    const hodlHodlFetch = $fetch(`/api/offers/${currency}/buy/hodlhodl`);
    const roboSatsFetch = $fetch(`/api/offers/${currency}/buy/robosats`);
    // const lnp2pbotFetch = $fetch(`/api/offers/${currency}/buy/lnp2pbot`);
    const peachFetch = $fetch(`/api/offers/${currency}/buy/peach`);

    const promises = [
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      peachFetch
    ];

    const [
      bisq,
      hodlHodl,
      roboSats,
      peach
    ] = await Promise.all(promises);

    const data = sortBy([
      ...bisq.data,
      ...hodlHodl.data,
      ...roboSats.data,
      ...peach.data
    ], 'price').reverse();

    const errors = [
      bisq.error,
      hodlHodl.error,
      roboSats.error,
      peach.error
    ].filter(error => error !== undefined);

    return { data, errors };
  } catch (error) {
    console.log('buy offers api error', error);
    setResponseStatus(event, 500);
    return { error: true, data: false };
  }
});

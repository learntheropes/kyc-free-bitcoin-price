import sortBy from 'lodash.sortby';

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency');

    const bisqFetch = $fetch(`/api/offers/${currency}/buy/bisq`);
    // const bityFetch = $fetch(`/api/offers/${currency}/buy/bity`);
    const hodlHodlFetch = $fetch(`/api/offers/${currency}/buy/hodlhodl`);
    const roboSatsFetch = $fetch(`/api/offers/${currency}/buy/robosats`);
    // const lnp2pbotFetch = $fetch(`/api/offers/${currency}/buy/lnp2pbot`);

    const promises = [
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch
    ];

    const [
      bisq,
      hodlHodl,
      roboSats
    ] = await Promise.all(promises);

    const data = sortBy([
      ...bisq.data,
      ...hodlHodl.data,
      ...roboSats.data
    ], 'price').reverse();

    const errors = [
      bisq.error,
      hodlHodl.error,
      roboSats.error
    ].filter(error => error !== undefined);

    return { data, errors };
  } catch (error) {
    console.log('buy offers api error', error);
    setResponseStatus(event, 500);
    return { error: true, data: false };
  }
});

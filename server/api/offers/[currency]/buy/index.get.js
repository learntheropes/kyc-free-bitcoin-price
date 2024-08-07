import { ofetch } from 'ofetch';
import sortBy from 'lodash.sortby';

export default defineEventHandler(async event => {

  try {
    const {
      public: {
        deploymentDomain
      }
    } = useRuntimeConfig();

    const currency = getRouterParam(event, 'currency');

    const customOfetch = ofetch.create({
      baseURL: deploymentDomain,
      async onRequestError({ request, error }) {
        console.error('Failed to fetch resource', request, error);
      },
      async onResponseError({ request, response }) {
        console.error('Failed to fetch resource', request, response.status, response.body);
      },
    });
  
    const bisqFetch = customOfetch(`/api/offers/${currency}/buy/bisq`);
    const bityFetch = customOfetch(`/api/offers/${currency}/buy/bity`);
    const hodlHodlFetch = customOfetch(`/api/offers/${currency}/buy/hodlhodl`);
    const roboSatsFetch = customOfetch(`/api/offers/${currency}/buy/robosats`);
    const lnp2pbotFetch = customOfetch(`/api/offers/${currency}/buy/lnp2pbot`);
  
    const promises = [
      bityFetch, 
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      lnp2pbotFetch
    ];
  
    const [
      bity,
      bisq,
      hodlHodl,
      roboSats,
      lnp2pbot
    ] = await Promise.all(promises);
  
    const data = sortBy([
      ...bity.data,
      ...bisq.data,
      ...hodlHodl.data,
      ...roboSats.data,
      ...lnp2pbot.data
    ], 'price').reverse();

    const errors = [
      bity.error,
      bisq.error,
      hodlHodl.error,
      roboSats.error,
      lnp2pbot.error
    ].filter(error => error !== undefined);

    return { 
      data,
      errors
    };
  } catch (error) {
    console.log('buy offers api error', error);
    setResponseStatus(event, 500);
    return {
      error: true,
      data: false
    };
  }
})
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
  
    const bisqFetch = customOfetch(`/api/offers/${currency}/sell/bisq`);
    const bityFetch = customOfetch(`/api/offers/${currency}/sell/bity`);
    const hodlHodlFetch = customOfetch(`/api/offers/${currency}/sell/hodlhodl`);
    const roboSatsFetch = customOfetch(`/api/offers/${currency}/sell/robosats`);
    const voucherBotFetch = customOfetch(`/api/offers/${currency}/sell/voucherbot`);
    const peachFetch = customOfetch(`/api/offers/${currency}/sell/peach`);
    const lnp2pbotFetch = customOfetch(`/api/offers/${currency}/sell/lnp2pbot`);
  
    const promises = [
      bityFetch, 
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      voucherBotFetch,
      peachFetch,
      lnp2pbotFetch
    ];
  
    const [
      bity,
      bisq,
      hodlHodl,
      roboSats,
      voucherBot,
      peach,
      lnp2pbot
    ] = await Promise.all(promises);
  
    const offers = sortBy([
      ...bity,
      ...bisq,
      ...hodlHodl,
      ...roboSats,
      ...voucherBot,
      ...peach,
      ...lnp2pbot
    ], 'price');

    appendResponseHeader(event, "Access-Control-Allow-Origin", "*");

    return { 
      data: offers,
      error: false
    };
  } catch (error) {
    console.log('sell offers api error', error);
    setResponseStatus(event, 500);
    return {
      error: true,
      data: false
    };
  }
})
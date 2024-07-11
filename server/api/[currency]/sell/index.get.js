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
  
    const bisqFetch = customOfetch(`/api/${currency}/sell/bisq`);
    const bityFetch = customOfetch(`/api/${currency}/sell/bity`);
    const hodlHodlFetch = customOfetch(`/api/${currency}/sell/hodlhodl`);
    const roboSatsFetch = customOfetch(`/api/${currency}/sell/robosats`);
    const voucherBotFetch = customOfetch(`/api/${currency}/sell/voucherbot`);
    const peachFetch = customOfetch(`/api/${currency}/sell/peach`);
  
    const promises = [
      bityFetch, 
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      voucherBotFetch,
      peachFetch
    ];
  
    const [
      bity,
      bisq,
      hodlHodl,
      roboSats,
      voucherBot,
      peach
    ] = await Promise.all(promises);
  
    const offers = sortBy([
      ...bity,
      ...bisq,
      ...hodlHodl,
      ...roboSats,
      ...voucherBot,
      ...peach
    ], 'price');

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
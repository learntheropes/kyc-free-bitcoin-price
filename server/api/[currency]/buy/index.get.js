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
  
    const bisqFetch = customOfetch(`/api/${currency}/buy/bisq`);
    const bityFetch = customOfetch(`/api/${currency}/buy/bity`);
    const hodlHodlFetch = customOfetch(`/api/${currency}/buy/hodlhodl`);
    const roboSatsFetch = customOfetch(`/api/${currency}/buy/robosats`);
  
    const promises = [
      bityFetch, 
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
    ];
  
    const [
      bity,
      bisq,
      hodlHodl,
      roboSats,
    ] = await Promise.all(promises);
  
    const offers = sortBy([
      ...bity,
      ...bisq,
      ...hodlHodl,
      ...roboSats,
    ], 'price').reverse();

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
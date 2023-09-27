import { ofetch } from 'ofetch';
import sortBy from 'lodash.sortby';

export default defineEventHandler(async event => {

  try {
    const {
      public: {
        deploymentDomain
      }
    } = useRuntimeConfig();

    console.log('deploymentDomain', deploymentDomain)

    const customOfetch = ofetch.create({
      baseURL: deploymentDomain,
      async onRequestError({ request, error }) {
        console.error('Failed to fetch resource', request, error);
      },
      async onResponseError({ request, response }) {
        console.error('Failed to fetch resource', request, response.status, response.body);
      },
    })
  
    const bisqFetch = customOfetch('/api/bisq');
    const bityFetch = customOfetch('/api/bity');
    const hodlHodlFetch = customOfetch('/api/hodl-hodl');
    const roboSatsFetch = customOfetch('/api/robo-sats');
    const voucherBotFetch = customOfetch('/api/voucher-bot');
  
    const promises = [
      bityFetch, 
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      voucherBotFetch
    ];
  
    const [
      bity,
      bisq,
      hodlHodl,
      roboSats,
      voucherBot
    ] = await Promise.all(promises);
  
    const offers = sortBy([
      ...bity,
      ...bisq,
      ...hodlHodl,
      ...roboSats,
      ...voucherBot
    ], 'price');

    return { 
      data: offers,
      error: false
    };
  } catch (error) {
    console.log('sell offers api error', error)
    setResponseStatus(event, 500);
    return {
      error: true,
      data: false
    };
  }
})
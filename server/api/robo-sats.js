import { ofetch } from 'ofetch';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {

  try {
    const response = await ofetch(`https://unsafe.robosats.com/api/book/?format=json&currency=2&type=1`, {
      timeout: 3000000,
      async onRequestError({ request, options, error }) {
        // Log error
        console.log("[fetch request error]", request, error);
      },
      async onResponseError({ request, response, options }) {
        // Log error
        console.log(
          "[fetch response error]",
          request,
          response.status,
          response.body
        );
      },
    });

    const methods = groupBy(response, 'payment_method');

    return Object.keys(methods).reduce((arr, method) => {
      const offer = parseFloat(minBy(methods[method], 'price').price).toFixed(2)
      const fee = (parseFloat(minBy(methods[method], 'price').price) * 0.175 / 100).toFixed(2)
  
      arr.push({
        service: 'RoboSats',
        method,
        price: parseFloat(offer + fee).toFixed(2)
      });
      
      return arr;
    }, []);

  } catch (error) {
    console.log('error', error)
    return []
  }
});
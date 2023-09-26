import tor from 'tor-request';
import groupBy from 'lodash.groupby';
import minBy from 'lodash.minby';

export default defineEventHandler(async event => {
  try {
    return await fetchRoboSats();
  } catch (error) {
    return [];
  }
});

const fetchRoboSats = () => {
  return new Promise((resolve, reject) => {
    return tor.request('http://robosats6tkf3eva7x2voqso3a5wcorsnw34jveyxfqi2fu7oyheasid.onion/api/book/?format=json&currency=2&type=1', function (error, res, body) {
      if (!error) {
        const methods = groupBy(JSON.parse(body), 'payment_method');
  
        const response = Object.keys(methods).reduce((arr, method) => {
          const offer = parseFloat(minBy(methods[method], 'price').price).toFixed(2);
          const fee = (parseFloat(minBy(methods[method], 'price').price) * 0.175 / 100).toFixed(2);
      
          method
            .split(' ')
            .filter(m => m !== '&' && m !== 'Friends' && m !== 'Family' && m !== 'Monero' && m !== 'USDT' && m !== 'L-USDt')
            .forEach(normilizedMethod => {
              arr.push({
                service: 'RoboSats',
                url: 'https://unsafe.robosats.com/',
                method: capitalize(normilizedMethod).replace('Instant', 'Sepa Instant'),
                price: parseFloat(offer + fee).toFixed(2)
              });
            })
          
          return arr;
        }, []);
  
        resolve(response);
      }
      else {
        console.log('error', error)
        reject([])
      }
    });
  });
};
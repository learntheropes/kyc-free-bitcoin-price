import groupBy from 'lodash.groupby'
import minBy from 'lodash.minby'
import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency')
    return await fetchRoboSatsSell(currency)
  } catch (error) {
    return { data: [], error: 'robosats' }
  }
})

async function fetchRoboSatsSell(currency) {
  const currencies = getCurrencies()
  const currencyIndex = currencies[currency]

  const base = 'http://otmoonrndnrddqdlhu6b36heunmbyw3cgvadqo2oqeau3656wfv7fwad.onion'
  const url = `${base}/api/book/?format=json&currency=${currencyIndex}&type=1`

  try {
    const agent = new SocksProxyAgent('socks5h://127.0.0.1:9050')

    const res = await got(url, {
      agent: { http: agent, https: agent },
      timeout: { request: 20000 },
      retry: { limit: 0 },

      // RoboSats returns 404 with JSON { not_found: ... } when no orders exist.
      // But I guess it will change in the future https://github.com/RoboSats/robosats/issues/2416
      throwHttpErrors: false,

      headers: {
        accept: 'application/json',
        'user-agent': 'kyc-free-bitcoin-price/1.0'
      }
    })

    const body = res.body

    let json
    try {
      json = JSON.parse(body)
    } catch (e) {
      return { data: [], error: 'robosats' }
    }

    // "No orders" — treat as empty results (NOT an outage), even if HTTP status is 404.
    if (json && typeof json === 'object' && !Array.isArray(json) && json.not_found) {
      return { data: [] }
    }

    // Any other non-2xx is a real error
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return { data: [], error: 'robosats' }
    }

    if (!Array.isArray(json)) {
      return { data: [], error: 'robosats' }
    }

    if (json.length === 0) {
      return { data: [] }
    }

    const methods = groupBy(json, 'payment_method')

    const data = Object.keys(methods).reduce((arr, method) => {
      const offer = parseFloat(minBy(methods[method], 'price').price)
      const fee = offer * 0.175 / 100

      method
        .split(' ')
        .filter(m =>
          m !== '&' &&
          m !== 'Friends' &&
          m !== 'Family' &&
          m !== 'Monero' &&
          m !== 'USDT' &&
          m !== 'L-USDt' &&
          m !== 'IT' &&
          m !== 'it' &&
          m !== 'It'
        )
        .forEach((normalizedMethod) => {
          arr.push({
            service: 'RoboSats',
            url: 'https://unsafe.robosats.com/',
            features: ['lightning', 'p2p', 'open-source'],
            method: capitalize(normalizedMethod).replace('Instant', 'Sepa Instant'),
            price: parseFloat(offer + fee)
          })
        })

      return arr
    }, [])

    return { data }
  } catch (error) {
    console.log('robosats sell api error', error?.message || error)
    return { data: [], error: 'robosats' }
  }
}

import groupBy from 'lodash.groupby'
import minBy from 'lodash.minby'
import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency')
    return await fetchBisqBuy(currency)
  } catch (error) {
    console.log('bisq buy api error', error?.message || error)
    return { data: [], error: 'bisq' }
  }
})

async function fetchBisqBuy(currency) {

  const url = `http://runbtcxzz4v2haszypwbrn2baqdo7tlwt6dw7g27cwwaootd4gktwayd.onion/api/offers?market=BTC_${currency}`

  try {
    const agent = new SocksProxyAgent('socks5h://127.0.0.1:9050')

    const res = await got(url, {
      agent: { http: agent, https: agent },
      timeout: { request: 20000 },
      headers: {
        accept: 'application/json',
        'user-agent': 'kyc-free-bitcoin-price/1.0'
      }
    })

    let offers
    try {
      offers = JSON.parse(res.body)
    } catch (e) {
      return { data: [], error: 'bisq' }
    }

    const key = `btc_${currency.toLowerCase()}`
    const buys = offers?.[key]?.buys

    if (!Array.isArray(buys) || buys.length === 0) {
      return { data: [] }
    }

    const methods = groupBy(buys, 'payment_method')
    const data = Object.keys(methods).reduce((arr, method) => {
      const offer = parseFloat(minBy(methods[method], 'price').price)
      const fee = offer * 1.15 / 100

      arr.push({
        service: 'Bisq',
        site: 'https://bisq.network/',
        features: ['on-chain', 'p2p', 'open-source'],
        method: capitalize(method.split('_').join(' ')).replace('F2f', 'In Person'),
        price: parseFloat(offer - fee)
      })

      return arr
    }, [])

    return { data }
  } catch (error) {
    console.log('bisq buy api error', error?.message || error)
    return { data: [], error: 'bisq' }
  }
}

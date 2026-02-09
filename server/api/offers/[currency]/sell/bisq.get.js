import groupBy from 'lodash.groupby'
import maxBy from 'lodash.maxby'
import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency')
    return await fetchBisqSell(currency)
  } catch (error) {
    console.log('bisq sell api error', error?.message || error)
    return { data: [], error: 'bisq' }
  }
})

const fetchBisqSell = async (currency) => {

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
    const sells = offers?.[key]?.sells

    if (!Array.isArray(sells) || sells.length === 0) {
      return { data: [] }
    }

    const methods = groupBy(sells, 'payment_method')
    const data = Object.keys(methods).reduce((arr, method) => {
      const offer = parseFloat(maxBy(methods[method], 'price').price)
      const fee = offer * 1.15 / 100

      arr.push({
        service: 'Bisq',
        site: 'https://bisq.network/',
        features: ['on-chain', 'p2p', 'open-source'],
        method: capitalize(method.split('_').join(' ')).replace('F2f', 'In Person'),
        price: parseFloat(offer + fee)
      })

      return arr
    }, [])

    return { data }
  } catch (error) {
    console.log('bisq sell api error', error?.message || error)
    return { data: [], error: 'bisq' }
  }
}

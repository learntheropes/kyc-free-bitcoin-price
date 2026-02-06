import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency')
    const size = 50

    const { price: basePrice } = await ofetch(
      `https://api.peachbitcoin.com/v1/market/price/BTC${currency}`
    )

    // 1) First call: get total + offers (sorted lowest premium)
    const first = await ofetch(
      `https://api.peachbitcoin.com/v1/offer/search/buy?sortBy=lowestPremium&size=${size}&page=0`
    )

    const total = Number(first?.total ?? 0)

    if (!Number.isFinite(total) || total <= 0) {
      return { data: [] }
    }

    // 2) Compute last page (0-based) to get highest premiums
    const lastPage = Math.floor((total - 1) / size)

    // 3) Fetch last page
    const last = await ofetch(
      `https://api.peachbitcoin.com/v1/offer/search/buy?sortBy=lowestPremium&size=${size}&page=${lastPage}`
    )

    // Offers on last page are still sorted low->high, so reverse to make it high->low
    const offers = Array.isArray(last?.offers) ? last.offers.slice().reverse() : []

    const data = []

    offers.forEach((offer) => {
      if (offer?.meansOfPayment?.[currency]) {
        offer.meansOfPayment[currency].forEach((method) => {
          data.push({
            service: 'Peach Bitcoin',
            url: 'https://peachbitcoin.com/referral?code=PR41CA',
            features: ['on-chain', 'p2p'],
            method: method.startsWith('cash.') ? 'Cash' : capitalize(method),
            price: basePrice * (offer.premium / 100 + 1) * 1.02,
          })
        })
      }
    })

    return { data }
  } catch (error) {
    console.log('peachbitcoin buy api error', error)
    return { error: 'peach bitcoin', data: [] }
  }
})

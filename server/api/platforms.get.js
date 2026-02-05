export default defineEventHandler(async event => {
  const platforms = ['Bisq', 'Bitcoin Voucher Bot', 'Hodl Hodl', 'Robosats', 'Peach Bitcoin']; // 'Bity', 'Lnp2pbot'
  return platforms.sort();
})
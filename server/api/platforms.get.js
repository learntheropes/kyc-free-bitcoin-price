export default defineEventHandler(async event => {
  const platforms = ['Bity', 'Bisq', 'Bitcoin Voucher Bot', 'Hodl Hodl', 'Robosats', 'Peach Bitcoin', 'Lnp2pbot'];
  return platforms.sort();
})
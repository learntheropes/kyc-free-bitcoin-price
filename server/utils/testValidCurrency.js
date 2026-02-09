export const testValidCurrency = async (event, currency) => {
  const allowedCurrencies = await $fetch('/api/currencies')

  if (!allowedCurrencies.includes(currency)) {
    setResponseStatus(event, 404)
    return false
  }

  return true
}

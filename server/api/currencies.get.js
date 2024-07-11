export default defineEventHandler(async event => {
    const currencies = getCurrencies();
    return Object.keys(currencies).sort();
})
export default defineEventHandler( async event => {
  appendResponseHeader(event, "Access-Control-Allow-Origin", "*");
})
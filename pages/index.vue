<script setup>
  import sortBy from 'lodash.sortby';

  const title = 'KYC Free Bitcoin Price'

  useHead({
    title: title,
    meta: [
      {
        name: 'description',
        content: 'Comparison website to purchase KYC free bitcoins at the cheapes price available on the free market.'
      },
    ],
  });

  let offers = ref([]);

  onMounted(async () => {

    const bityFetch = $fetch('/api/bity');
    const bisqFetch = $fetch('/api/bisq');
    const hodlHodlFetch = $fetch('/api/hodl-hodl');
    const roboSatsFetch = $fetch('/api/robo-sats');
    const voucherBotFetch = $fetch('/api/voucher-bot');

    const promises = [
      bityFetch, 
      bisqFetch,
      hodlHodlFetch,
      roboSatsFetch,
      voucherBotFetch
    ];

    const [
      bity,
      bisq,
      hodlHodl,
      roboSats,
      voucherBot
    ] = await Promise.all(promises);

    offers.value = sortBy([
      ...bity,
      ...bisq,
      ...hodlHodl,
      ...roboSats,
      ...voucherBot
    ], 'price');

    const { $event } = useNuxtApp();
    $event('isLoading', false);
  });
</script>
<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-narrow">
          <h1 class="title is-1 has-text-centered">{{ title }}</h1>
          <div class="subtitle is-6 has-text-centered">
            <span class="icon">
              <i class="mdi mdi-github" />
            </span>
            <NuxtLink
              href="https://github.com/learntheropes/kyc-free-bitcoin-price"
              target="_blank"
            >learntheropes/kyc-free-bitcoin-price</NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="columns is-centered is-multiline is-variable is-16">
        <div class="column is-narrow block">
          <div class="columns is-centered">
            <div class="column is-narrow">
              <h1 class="title is-4 has-text-centered">BUY (Sell Offers)</h1>
              <div class="subtitle is-6 has-text-centered">
                <span class="icon">
                  <i class="mdi mdi-developer-board" />
                </span>
                <NuxtLink
                  href="/api/offers/sell"
                  target="_blank"
                >/api/offers/sell</NuxtLink>
              </div>
            </div>
          </div>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <NuxtLink
                  :href="offer.url"
                  target="_blank"
                >{{ offer.service }}</NuxtLink>
                <div class="is-hidden-tablet">
                  <ServiceFeatures :offer="offer" />
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <ServiceFeatures :offer="offer" />
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <span>{{ offer.method.replace(/\(([^\)]+)\)/, '') }}</span>
                <div class="is-hidden-tablet">&nbsp;</div>
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <span class="has-text-primary has-text-weight-bold">{{ offer.price }}<span class="is-hidden-tablet">&nbsp;€</span></span> 
                <span>&nbsp;</span>
                <span class="has-text-grey is-size-7 is-hidden-mobile">EUR/BTC</span>
                <div class="is-hidden-tablet has-text-right">
                  <span class="is-hidden-tablet has-text-right">+</span>
                  <span class="has-text-primary is-hidden-tablet has-text-right">{{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }}</span>
                  <span class="is-hidden-tablet has-text-right">%</span>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block has-text-right"
              >
                <span>+</span>
                <span class="has-text-primary">{{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }}</span>
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-narrow block">
          <div class="columns is-centered">
            <div class="column is-narrow">
              <h1 class="title is-4 has-text-centered">SELL (Buy Offers)</h1>
              <div class="subtitle is-6 has-text-centered">
                <span class="icon">
                  <i class="mdi mdi-developer-board" />
                </span>
                <NuxtLink
                  href="/api/offers/buy"
                  target="_blank"
                >/api/offers/buy</NuxtLink>
              </div>
            </div>
          </div>

          <!-- START FAKE DATA -->
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <NuxtLink
                  :href="offer.url"
                  target="_blank"
                >{{ offer.service }}</NuxtLink>
                <div class="is-hidden-tablet">
                  <span 
                    v-if="offer.features.includes('on-chain')" 
                    class="icon is-small"
                  >
                    <i class="mdi mdi-bitcoin"></i>
                  </span>
                  <span 
                    v-if="offer.features.includes('lightning')" 
                    class="icon is-small"
                  >
                    <i class="mdi mdi-lightning-bolt"></i>
                  </span>
                  <span 
                    v-if="offer.features.includes('p2p')" 
                    class="icon is-small"
                  >
                    <i class="mdi mdi-account-multiple"></i>
                  </span>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <span 
                  v-if="offer.features.includes('on-chain')" 
                  class="icon is-small"
                >
                  <i class="mdi mdi-bitcoin"></i>
                </span>
                <span 
                  v-if="offer.features.includes('lightning')" 
                  class="icon is-small"
                >
                  <i class="mdi mdi-lightning-bolt"></i>
                </span>
                <span 
                  v-if="offer.features.includes('p2p')" 
                  class="icon is-small"
                >
                  <i class="mdi mdi-account-multiple"></i>
                </span>
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <span>{{ offer.method.replace(/\(([^\)]+)\)/, '') }}</span>
                <div class="is-hidden-tablet">&nbsp;</div>
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block"
              >
                <span class="has-text-primary has-text-weight-bold">{{ offer.price }}<span class="is-hidden-tablet">&nbsp;€</span></span> 
                <span>&nbsp;</span>
                <span class="has-text-grey is-size-7 is-hidden-mobile">EUR/BTC</span>
                <div class="is-hidden-tablet has-text-right">
                  <span class="is-hidden-tablet has-text-right">+</span>
                  <span class="has-text-primary is-hidden-tablet has-text-right">{{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }}</span>
                  <span class="is-hidden-tablet has-text-right">%</span>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div 
                v-for="(offer, index) of offers" 
                :key="index"
                class="block has-text-right"
              >
                <span>+</span>
                <span class="has-text-primary">{{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }}</span>
                <span>%</span>
              </div>
            </div>
          </div>
          <!-- END FAKE DATA -->
          
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.columns.is-variable.is-16 {
  --columnGap: 4rem;
}
</style>
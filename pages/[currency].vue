<script setup>
  import sortBy from 'lodash.sortby';

  const { 
    params: { 
      currency 
    }
  } = useRoute();

  const nonDecimalsCurrencies = ['ARS', 'VES']
  const decimals = (nonDecimalsCurrencies.includes(currency)) ? 0 : 2;

  let sellOffers = ref([]);
  let buyOffers = ref([]);

  onMounted(async () => {

    const buyOffersFetch = $fetch(`/api/offers/${currency}/buy`);
    const sellOffersFetch = $fetch(`/api/offers/${currency}/sell`);

    const promises = [
      buyOffersFetch,
      sellOffersFetch
    ];

    const [
      buy,
      sell
    ] = await Promise.all(promises);

    buyOffers.value = await sortBy(buy.data, 'price').reverse();
    sellOffers.value = await sortBy(sell.data, 'price');

    const { $event } = useNuxtApp();
    $event('isLoading', false);
  });
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns is-centered is-multiline is-variable is-16">
        
        <div class="column is-narrow block">
          <div class="columns is-centered">
            <div class="column is-narrow">
              <h1 class="title is-4 has-text-centered">{{ currency }} BID (Buy Offers)</h1>
              <div class="subtitle is-6 has-text-centered">
                <span class="icon">
                  <i class="mdi mdi-developer-board" />
                </span>
                <NuxtLink
                  :href="'/api/offers/'+currency+'/buy'"
                  target="_blank"
                >/api/offers/{{ currency }}/buy</NuxtLink>
              </div>
            </div>
          </div>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of buyOffers" 
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
                v-for="(offer, index) of buyOffers" 
                :key="index"
                class="block"
              >
                <ServiceFeatures :offer="offer" />
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of buyOffers" 
                :key="index"
                class="block"
              >
                <span>{{ offer.method.replace(/\(([^\)]+)\)/, '') }}</span>
                <div class="is-hidden-tablet">&nbsp;</div>
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of buyOffers" 
                :key="index"
                class="block"
              >
                <span class="has-text-primary has-text-weight-bold">{{ offer.price.toFixed(decimals) }}<span class="is-hidden-tablet">&nbsp;€</span></span> 
                <span>&nbsp;</span>
                <span class="has-text-grey is-size-7 is-hidden-mobile">{{ currency }}/BTC</span>
                <div class="is-hidden-tablet has-text-right">
                  <span class="is-hidden-tablet has-text-right">-</span>
                  <span class="has-text-primary is-hidden-tablet has-text-right">{{ ((offer.price - buyOffers[0].price) / buyOffers[0].price * 100).toFixed(2) }}</span>
                  <span class="is-hidden-tablet has-text-right">%</span>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div 
                v-for="(offer, index) of buyOffers" 
                :key="index"
                class="block has-text-right"
              >
                <span>-</span>
                <span class="has-text-primary">{{ ((offer.price - buyOffers[0].price) / buyOffers[0].price * 100).toFixed(2) }}</span>
                <span>%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-narrow block">
          <div class="columns is-centered">
            <div class="column is-narrow">
              <h1 class="title is-4 has-text-centered">{{ currency }} ASK (Sell Offers)</h1>
              <div class="subtitle is-6 has-text-centered">
                <span class="icon">
                  <i class="mdi mdi-developer-board" />
                </span>
                <NuxtLink
                  :href="'/api/offers/'+currency+'/sell'"
                  target="_blank"
                >/api/offers/{{ currency }}/sell</NuxtLink>
              </div>
            </div>
          </div>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of sellOffers" 
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
                v-for="(offer, index) of sellOffers" 
                :key="index"
                class="block"
              >
                <ServiceFeatures :offer="offer" />
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of sellOffers" 
                :key="index"
                class="block"
              >
                <span>{{ offer.method.replace(/\(([^\)]+)\)/, '') }}</span>
                <div class="is-hidden-tablet">&nbsp;</div>
              </div>
            </div>
            <div class="column is-narrow">
              <div 
                v-for="(offer, index) of sellOffers" 
                :key="index"
                class="block"
              >
                <span class="has-text-primary has-text-weight-bold">{{ offer.price.toFixed(decimals) }}<span class="is-hidden-tablet">&nbsp;€</span></span> 
                <span>&nbsp;</span>
                <span class="has-text-grey is-size-7 is-hidden-mobile">{{ currency }}/BTC</span>
                <div class="is-hidden-tablet has-text-right">
                  <span class="is-hidden-tablet has-text-right">+</span>
                  <span class="has-text-primary is-hidden-tablet has-text-right">{{ ((offer.price - sellOffers[0].price) / sellOffers[0].price * 100).toFixed(2) }}</span>
                  <span class="is-hidden-tablet has-text-right">%</span>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div 
                v-for="(offer, index) of sellOffers" 
                :key="index"
                class="block has-text-right"
              >
                <span>+</span>
                <span class="has-text-primary">{{ ((offer.price - sellOffers[0].price) / sellOffers[0].price * 100).toFixed(2) }}</span>
                <span>%</span>
              </div>
            </div>
          </div>
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
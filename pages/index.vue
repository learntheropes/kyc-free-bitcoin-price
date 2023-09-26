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

  const bityFetch = useFetch('/api/bity');
  const bisqFetch = useFetch('/api/bisq');
  const hodlHodlFetch = useFetch('/api/hodl-hodl');
  const roboSatsFetch = useFetch('/api/robo-sats');

  const promises = [
    bityFetch, 
    bisqFetch,
    hodlHodlFetch,
    roboSatsFetch
  ];

  const [
    { 
      data: { 
        value: bity 
      }
    },
    {
      data: { 
        value: bisq 
      }
    },
    {
      data: { 
        value: hodlHodl 
      }
    },
    {
      data: { 
        value: roboSats 
      }
    }
  ] = await Promise.all(promises);

  const offers = sortBy([
    ...bity,
    ...bisq,
    ...hodlHodl,
    ...roboSats
  ], 'price');
</script>
<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns is-centered">
        <div class="column is-narrow">
          <h1 class="title is-1 has-text-centered">{{ title }}</h1>
          <div class="subtitle is-6 has-text-centered">
            <span class="icon">
              <i class="mdi mdi-github"></i>
            </span>
            <NuxtLink
              href="https://github.com/learntheropes/kyc-free-bitcoin-price"
              target="_blank"
            >kyc-free-bitcoin-price</NuxtLink>
          </div>
        </div>
      </div>
      <div class="columns is-mobile is-centered">
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
            <div class="has-text-primary is-hidden-tablet">+ {{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }} %</div>
          </div>
        </div>
        <div class="column is-narrow is-hidden-mobile">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
            class="block has-text-right"
          >
            <span class="has-text-primary">+ {{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }} %</span>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

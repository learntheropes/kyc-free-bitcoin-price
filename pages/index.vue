<script setup>
  import sortBy from 'lodash.sortby';

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

  const offers = ref(sortBy([
    ...bity,
    ...bisq,
    ...hodlHodl,
    ...roboSats
  ], 'price'));
</script>
<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns is-centered">
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
          </div>
        </div>
        <div class="column is-narrow">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
            class="block"
          >{{ offer.method }}</div>
        </div>
        <div class="column is-narrow">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
            class="block"
          >
            <span class="has-text-primary has-text-weight-bold">{{ offer.price }}</span> 
            <span>&nbsp;</span>
            <span class="has-text-grey">EUR/BTC</span> 
          </div>
        </div>
        <div class="column is-narrow">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
            class="block has-text-right"
          >
            <span v-if="index === 0">&nbsp;</span>
            <span v-else class="has-text-primary">+ {{ ((offer.price - offers[0].price) / offers[0].price * 100).toFixed(2) }} %</span>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

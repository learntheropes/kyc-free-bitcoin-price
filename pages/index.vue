<script setup>
  import sortBy from 'lodash.sortby';

  const bityFetch = useFetch('/api/bity');
  const bisqFetch = useFetch('/api/bisq');
  const hodlHodlFetch = useFetch('/api/hodl-hodl');

  const promises = [
    bityFetch, 
    bisqFetch,
    hodlHodlFetch
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
    }
  ] = await Promise.all(promises);

  const offers = ref(sortBy([
    ...bity,
    ...bisq,
    ...hodlHodl,
  ], 'price'));

  onMounted(async() => {
    const roboSats = await $fetch('/api/robo-sats')
    offers.value = [
      ...offers.value,
      ...roboSats
    ]
  })
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns">
        <div class="column is-narrow">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
          >{{ offer.service }}</div>
        </div>
        <div class="column is-narrow">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
          >{{ offer.method }}</div>
        </div>
        <div class="column is-narrow">
          <div 
            v-for="(offer, index) of offers" 
            :key="index"
          >
            <span class="has-text-primary">{{ offer.price }}</span> 
            <span>&nbsp;</span>
            <span class="has-text-warning">EUR/BTC</span> 
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

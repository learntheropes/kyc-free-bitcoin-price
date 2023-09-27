<script setup>
const {
  offer
} = defineProps({
  offer: {
    type: Object,
    required: true
  }
})
</script>

<template>
<div>
  <span 
    v-if="offer.features.includes('on-chain')" 
      class="icon is-small"
    >
      <i class="mdi mdi-bitcoin" />
    </span>
    <span 
      v-if="offer.features.includes('lightning')" 
      class="icon is-small"
    >
      <i class="mdi mdi-lightning-bolt" />
    </span>
    <span 
      v-if="offer.features.includes('p2p')" 
      class="icon is-small"
    >
      <i class="mdi mdi-account-multiple" />
    </span>
    <span 
      v-if="offer.features.includes('open-source')" 
      class="icon is-small"
    >
      <i class="mdi mdi-open-source-initiative" />
    </span>
</div>
</template>
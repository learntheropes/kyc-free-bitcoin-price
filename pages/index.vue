<script setup>
  const currencies = await $fetch(`/api/currencies`);
  const platforms = await $fetch(`/api/platforms`);
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="subtitle is-6 has-text-centered">
        <span class="icon">
          <i class="mdi mdi-developer-board" />
        </span>
        <NuxtLink
          :href="'/api/currencies'"
          target="_blank"
        >/api/currencies</NuxtLink>
      </div>
      <div class="buttons is-centered">
        <NuxtLink 
          v-for="currency in currencies" 
          :key="currency" 
          :to="'/'+currency"
          class="button"
        >
          {{ currency }}
        </NuxtLink>
      </div>
    </section>
    <section class="section has-text-centered">
      <div class="subtitle is-6 has-text-centered">
        <span class="icon">
          <i class="mdi mdi-developer-board" />
        </span>
        <NuxtLink
          :href="'/api/platforms'"
          target="_blank"
        >/api/platforms</NuxtLink>
      </div>
      {{ platforms.join(', ') }}
    </section>
  </NuxtLayout>
</template>

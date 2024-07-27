<script setup>
  const currencies = await $fetch(`/api/currencies`);
  const platforms = await $fetch(`/api/platforms`);
</script>

<template>
  <NuxtLayout>
    <section class="section">
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
    <section class="section has-text-centered">{{ platforms.join(', ') }}</section>
  </NuxtLayout>
</template>

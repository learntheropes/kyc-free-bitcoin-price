<script setup>
  const currencies = await $fetch(`/api/currencies`);
  const platforms = await $fetch(`/api/platforms`);
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns is-centered is-multiline is-variable is-16">
        <div class="buttons">
          <NuxtLink 
            v-for="currency in currencies" 
            :key="currency" 
            :to="'/'+currency"
            class="button"
          >
            {{ currency }}
          </NuxtLink>
        </div>
      </div>
    </section>
    <section class="section has-text-centered">{{ platforms.join(', ') }}</section>
  </NuxtLayout>
</template>

<style scoped>
.columns.is-variable.is-16 {
  --columnGap: 4rem;
}
</style>
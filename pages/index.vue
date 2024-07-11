<script setup>
  const currencies = await $fetch(`/api/currencies`);
</script>

<template>
  <NuxtLayout>
    <section class="section">
      <div class="columns is-centered is-multiline is-variable is-16">
        
        <div class="buttons">
          <div 
            v-for="currency in currencies" 
            :key="currency" 
            class="button"
          ><NuxtLink :to="'/'+currency">{{ currency }}</NuxtLink></div>
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
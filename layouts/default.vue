<script setup>
const route = useRoute()

const title = 'P2Pay Market — Bitcoin P2P Offer Comparator & Spread Index'

useHead({
  title: title,
  meta: [
    {
      name: 'description',
      content: 'Multi-rail Bitcoin P2P offer comparator and spread monitor. Aggregates public order books across peer-to-peer trading rails with normalized pricing and API access.'
    },
  ],
});
</script>

<template>
  <div>
    <Html>

    <Body>
      <div class="full-body">
        <main class="main-content">
          <div class="container">
            <section class="section">
              <div class="columns is-centered">
                <div class="column is-narrow">
                  <h1 class="title is-1 has-text-centered">
                    <NuxtLink to="/" class="has-text-black">{{ title }}</NuxtLink>
                  </h1>
                  <div class="subtitle is-6 has-text-centered">
                    <span class="icon">
                      <i class="mdi mdi-github" />
                    </span>
                    <NuxtLink href="https://github.com/learntheropes/kyc-free-bitcoin-price" target="_blank">
                      learntheropes/kyc-free-bitcoin-price</NuxtLink>
                  </div>
                </div>
              </div>
            </section>
            <slot />
          </div>
        </main>
        <LoadingOffers v-if="route.name === 'currency'" />
        <LayoutFooter v-if="route.name === 'currency'" />
      </div>
    </Body>

    </Html>
  </div>
</template>

<style scoped>
.full-body {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
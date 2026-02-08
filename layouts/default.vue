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

            <!-- HERO -->
            <section class="section">
              <div class="columns is-centered">
                <div class="column is-10 has-text-centered">

                  <h1 class="title is-1">
                    <NuxtLink to="/" class="has-text-black">
                      {{ title }}
                    </NuxtLink>
                  </h1>

                  <div class="subtitle is-6">
                    <span class="icon">
                      <i class="mdi mdi-github" />
                    </span>
                    <NuxtLink href="https://github.com/p2payto/p2pay-market" target="_blank">
                      p2payto/p2pay-market
                    </NuxtLink>
                  </div>

                  <!-- SEO CONTEXT BLOCK -->
                  <div class="content mt-5 has-text-left">
                    <p>
                      <strong>P2Pay Market</strong> is a multi-rail Bitcoin P2P offer index.
                      It aggregates public order books across peer-to-peer trading rails,
                      normalizes pricing per fiat currency, and exposes a stable UI and API
                      for spread and liquidity analysis.
                    </p>

                    <p>
                      This project is designed as an infrastructure layer for
                      <strong>settlement-first payment flows</strong>.
                      In the long run, the APIs published here will be consumed by
                      <strong>p2pay-core</strong> to detect which market is the most
                      liquid at any given moment and route payment intent toward that rail
                      (best availability, best execution), instead of hard-coding a single provider.
                    </p>

                    <p>
                      If you are building payment systems that must work across countries,
                      currencies, and inconsistent rails, this index helps you observe
                      real market conditions — liquidity and spreads —
                      and make routing decisions based on data rather than assumptions.
                    </p>
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

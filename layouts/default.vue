<template>
  <div>
    <Html>
      <!-- <Head>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
      </Head> -->
      <Body>
        <div class="full-body">
          <main class="main-content">
            <div class="container">
              <slot />
            </div>
          </main>
          <!-- <LayoutFooter /> -->
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
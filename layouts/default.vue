
<template>
  <div>
    <Html>
      <Body>
        <div class="full-body">
          <main class="main-content">
            <div class="container">
              <slot />
            </div>
          </main>
          <LoadingOffers />
          <LayoutFooter />
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
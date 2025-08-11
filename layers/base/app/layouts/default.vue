<template>
  <div class="layout-container">
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
    <AppSideBar :is-open="isSidebarOpen" />
    <main
      class="main-content"
      :class="{
        'ml-64': isSidebarOpen,
      }"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
  const isSidebarOpen = ref(true);
</script>

<style scoped>
  .layout-container {
    height: calc(100vh - 4rem);
    background-color: var(--ui-bg);
  }

  .main-content {
    height: 100%;
    margin-top: 4rem;
  }
</style>

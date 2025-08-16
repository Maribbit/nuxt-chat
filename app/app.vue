<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<script setup lang="ts">
  const { fetchChats } = useChats();
  const { fetchProjects } = useProjects();
  Promise.all([fetchChats(), fetchProjects()]);
</script>

<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <RouterView />
  </n-config-provider>
</template>

<style scoped></style>

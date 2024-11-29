<script setup lang="ts">
import Layout from '@/Components/Layout.vue'
</script>

<template>
  <n-message-provider>
    <layout>
      <router-view />
    </layout>
  </n-message-provider>
</template>

<style scoped></style>

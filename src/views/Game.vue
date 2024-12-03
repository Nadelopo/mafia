<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const roomId = Number(route.params.roomId)
</script>

<template>
  <div>game {{ roomId }}</div>
</template>

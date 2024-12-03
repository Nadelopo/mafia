<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const gameId = Number(route.params.gameId)
</script>

<template>
  <div>game {{ gameId }}</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import Leader from './Leader.vue'
import Player from './Player.vue'
import { useGameStore } from '@/stores/gameStore'

const { user } = storeToRefs(useUserStore())

const { currentGameId } = storeToRefs(useGameStore())

const route = useRoute()
currentGameId.value = Number(route.params.gameId)

const { isLeader, isGameLoading } = storeToRefs(useGameStore())
</script>

<template>
  <div class="container">
    <template v-if="!isGameLoading">
      <div class="mb-5">Имя пользователя: {{ user?.name }}</div>
      <Leader v-if="isLeader" />
      <Player v-else />
    </template>
  </div>
</template>

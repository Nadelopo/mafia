<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import { useUserStore } from '@/stores/userStore'
import Leader from './Leader.vue'
import Player from './Player.vue'
import { gameInjectionKey } from './gameInjection'

const { isUserAuthenticated } = useUserStore()
const { user } = storeToRefs(useUserStore())

const route = useRoute()
const gameId = Number(route.params.gameId)

const game = ref<TablesRow<'games'> | null>(null)

const isLoading = ref(true)
const isLeader = ref(false)

onBeforeMount(async () => {
  const [{ data }, userData] = await Promise.all([
    supabase.from('games').select().eq('id', gameId).single(),
    isUserAuthenticated()
  ])
  isLoading.value = false

  game.value = data

  isLeader.value = Boolean(
    userData?.id && game.value && userData?.id === game.value?.leaderId
  )
})

provide(gameInjectionKey, { game, gameId })
</script>

<template>
  <div class="container">
    <div class="mb-5">Имя пользователя: {{ user?.name }}</div>
    <template v-if="!isLoading">
      <Leader v-if="isLeader" />
      <Player v-else />
    </template>
  </div>
</template>

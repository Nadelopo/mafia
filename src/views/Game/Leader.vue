<script setup lang="ts">
import { inject } from 'vue'
import { NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import { gameInjectionKey } from './gameInjection'
import PlayersListLeader from '@/components/Games/PlayersListLeader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { gameId, game } = inject(gameInjectionKey)!

const startGame = async () => {
  const { error } = await supabase
    .from('games')
    .update({ gameActive: true })
    .eq('id', gameId)

  await router.push({ name: 'CardPlayer' })
  if (!error && game.value) {
    game.value.gameActive = true
  }
}
</script>

<template>
  <p>Номер комнаты: {{ gameId }}</p>
  <players-list-leader />
  <div>
    <n-button @click="startGame">Начать игру</n-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import { useGameStore } from '@/stores/gameStore'
import PlayersListLeader from '@/components/Games/PlayersListLeader.vue'

const router = useRouter()

const { game, currentGameId } = storeToRefs(useGameStore())

const startGame = async () => {
  const { error } = await supabase
    .from('games')
    .update({ gameActive: true })
    .eq('id', currentGameId.value)

  await router.push({ name: 'CardPlayer' })
  if (!error && game.value) {
    game.value.gameActive = true
  }
}
</script>

<template>
  <p>Номер комнаты: {{ currentGameId }}</p>
  <players-list-leader />
  <div>
    <n-button @click="startGame">Начать игру</n-button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import { gameInjectionKey } from './gameInjection'
import PlayersListLeader from '@/components/Games/PlayersListLeader.vue'

const { gameId, game } = inject(gameInjectionKey)!

const startGame = async () => {
  const { error } = await supabase
    .from('games')
    .update({ gameActive: true })
    .eq('id', gameId)
  if (!error && game.value) {
    game.value.gameActive = true
  }
}
</script>

<template>
  <players-list-leader />
  <div>
    <n-button @click="startGame">Начать игру</n-button>
  </div>
</template>

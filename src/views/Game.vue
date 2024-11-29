<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'

type Player = TablesRow<'game_players'> & {
  users: Pick<TablesRow<'users'>, 'name'>
}

const route = useRoute()
const gameId = Number(route.params.gameId)

const game = ref<TablesRow<'games'> | null>(null)

onBeforeMount(async () => {
  const gameQuery = supabase.from('games').select().eq('id', gameId).single()

  const gamePlayerQuery = supabase
    .from('game_players')
    .select('*, users!inner(name)')
    .eq('gameId', gameId)

  const [{ data: gameData }, { data: gamePlayersData }] = await Promise.all([
    gameQuery,
    gamePlayerQuery
  ])

  game.value = gameData
  if (gamePlayersData) {
    players.value = gamePlayersData
  }
})

const players = ref<Player[]>([])

{
  const addPlayer = async (id: number) => {
    const { data, error } = await supabase
      .from('game_players')
      .select('*, users!inner(name)')
      .eq('id', id)
      .single()
    if (error) return
    players.value.push(data)
  }
  const gamePlayersSubscription = supabase
    .channel('player-connection-tracking')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_players',
        filter: `gameId=eq.${gameId}`
      },
      async (payload) => {
        const player = payload.new as TablesRow<'game_players'>
        addPlayer(player.id)
      }
    )
    .subscribe()

  watch(
    () => players.value.length,
    (quantity) => {
      if (quantity === game.value?.maxPlayers) {
        gamePlayersSubscription.unsubscribe()
      }
    }
  )

  onUnmounted(() => {
    gamePlayersSubscription.unsubscribe()
  })
}
</script>

<template>
  <div>game {{ gameId }}</div>
  <div>
    <div v-for="player in players" :key="player.id">
      {{ player.users.name }}
    </div>
  </div>
</template>

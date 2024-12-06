<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import { useGameStore } from '@/stores/gameStore'
import type { TablesRow } from '@/supabase/database.types'
import { useUserStore } from '@/stores/userStore'
import { usePlayersSubscription } from '@/components/Games/usePlayersSubscription'
import CardPlayer from '@/components/Games/CardPlayer.vue'
import TablePlayers from '@/components/Games/TablePlayers.vue'

type Player = TablesRow<'game_players'> & {
  users: Pick<TablesRow<'users'>, 'name'>
}

const players = ref<Player[]>([])

const { currentGameId } = storeToRefs(useGameStore())

const { isUserAuthenticated } = useUserStore()

const playerRole = ref<TablesRow<'roles'> | null>(null)
const getPlayerRole = async () => {
  const user = await isUserAuthenticated()
  if (!user) return null

  const { data } = await supabase
    .from('game_players')
    .select('roles(*)')
    .eq('userId', user.id)
    .single()

  return data?.roles ?? null
}

const router = useRouter()
watch(
  currentGameId,
  async () => {
    if (!currentGameId.value) return

    const [{ data: playersData }, roleData] = await Promise.all([
      supabase
        .from('game_players')
        .select('*, users!inner(name)')
        .eq('gameId', currentGameId.value!)
        .order('id'),
      getPlayerRole()
    ])

    players.value = playersData ?? []
    playerRole.value = roleData
    if (!players.value.find((e) => user.value && e.userId === user.value.id)) {
      router.push({ name: 'Welcome' })
    }
  },
  { immediate: true }
)

const { user } = storeToRefs(useUserStore())

const updateUserRoleSubscription = supabase
  .channel('update-player-role')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'game_players',
      filter: `userId=eq.${user.value?.id}`
    },
    async () => {
      playerRole.value = await getPlayerRole()
    }
  )
  .subscribe()

const gameStartSubscription = supabase
  .channel('game-start-tracking')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'games',
      filter: `id=eq.${currentGameId.value}`
    },
    () => {
      updateUserRoleSubscription.unsubscribe()
      gameStartSubscription.unsubscribe()
    }
  )
  .subscribe()

usePlayersSubscription({
  onPlayerConnect: async (payload) => {
    const { data, error } = await supabase
      .from('game_players')
      .select('*, users!inner(name), roles(*)')
      .eq('id', payload.id)
      .single()
    if (error) return
    players.value.push(data)
  },
  onPlayerDisconnect: async (payload) => {
    if (players.value.find((e) => e.id === payload.id)) {
      players.value = players.value.filter((player) => player.id !== payload.id)
    }
  }
})
</script>

<template>
  <card-player :player-role />
  <table-players :players />
</template>

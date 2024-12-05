<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import { useUserStore } from '@/stores/userStore'
import { gameInjectionKey } from '@/views/Game/gameInjection'
import { useConnectPlayersSubscription } from './useConnectPlayersSubscription'

export type Player = TablesRow<'game_players'> & {
  users: Pick<TablesRow<'users'>, 'name'>
}

const players = ref<Player[]>([])

const { gameId } = inject(gameInjectionKey)!

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

onBeforeMount(async () => {
  const [{ data: playersData }, roleData] = await Promise.all([
    supabase
      .from('game_players')
      .select('*, users!inner(name)')
      .eq('gameId', gameId)
      .order('id'),
    getPlayerRole()
  ])

  players.value = playersData ?? []
  playerRole.value = roleData
})

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
      filter: `id=eq.${gameId}`
    },
    () => {
      updateUserRoleSubscription.unsubscribe()
      gameStartSubscription.unsubscribe()
    }
  )
  .subscribe()

const addPlayer = async (id: number) => {
  const { data, error } = await supabase
    .from('game_players')
    .select('*, users!inner(name), roles(*)')
    .eq('id', id)
    .single()
  if (error) return
  players.value.push(data)
}

useConnectPlayersSubscription(() => players.value.length, addPlayer)
</script>

<template>
  <div>
    <div>Твоя роль: {{ playerRole?.title }}</div>
    <div v-for="player in players" :key="player.id">
      {{ player.users.name }}
    </div>
  </div>
</template>

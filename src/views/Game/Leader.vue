<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import { randomizer } from '@/shared/utils/randomizer'
import { useGameStore } from '@/stores/gameStore'
import { usePlayersSubscription } from '@/components/Games/usePlayersSubscription'
import type { TablesRow } from '@/supabase/database.types'

const router = useRouter()

type Player = TablesRow<'game_players'> & {
  users: Pick<TablesRow<'users'>, 'name'>
  roles: TablesRow<'roles'> | null
}

const players = ref<Player[]>([])

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

const { currentGameId, game } = storeToRefs(useGameStore())

onBeforeMount(async () => {
  const { data, error } = await supabase
    .from('game_players')
    .select('*, users!inner(name), roles(*)')
    .eq('gameId', currentGameId.value!)
    .order('id')
  if (error) return

  players.value = data
})

const setRoleForPlayers = async () => {
  if (!game.value || game.value.gameActive) return
  const assignedRoles = randomizer(game.value.maxPlayers, game.value.roles)
  if (!assignedRoles) return

  const newPlayers = players.value.map((player, index) => {
    const { users: _, roles: __, ...tableColumns } = player
    return { ...tableColumns, roleId: assignedRoles[index] }
  })

  const { data, error } = await supabase
    .from('game_players')
    .upsert(newPlayers, { onConflict: 'id' })
    .select('id, roles(*), users(name)')
  if (error) return

  players.value = players.value.map((player) => {
    const foundPlayer = data.find((el) => el.id === player.id)!
    return { ...player, roles: foundPlayer.roles! }
  })
}

const startGame = async () => {
  const { error } = await supabase
    .from('games')
    .update({ gameActive: true })
    .eq('id', currentGameId.value!)

  await router.push({ name: 'CardPlayer' })
  if (!error && game.value) {
    game.value.gameActive = true
  }
}
</script>

<template>
  <p>Номер комнаты: {{ currentGameId }}</p>
  <div v-for="player in players" :key="player.id">
    {{ player.users.name }} - {{ player.roles?.title }}
  </div>
  <n-button class="my-5" @click="setRoleForPlayers">
    {{ players?.[0]?.roles ? 'Перераспределить' : 'Распределить ' }}
  </n-button>
  <div>
    <n-button @click="startGame">Начать игру</n-button>
  </div>
</template>

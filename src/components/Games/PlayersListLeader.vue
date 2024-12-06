<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import type { GameRole, TablesRow } from '@/supabase/database.types'
import { useConnectPlayersSubscription } from './useConnectPlayersSubscription'
import { useGameStore } from '@/stores/gameStore'

export type Player = TablesRow<'game_players'> & {
  users: Pick<TablesRow<'users'>, 'name'>
  roles: TablesRow<'roles'> | null
}

const players = ref<Player[]>([])

const { currentGameId, game } = storeToRefs(useGameStore())

useConnectPlayersSubscription(
  () => players.value.length,
  async (id) => {
    const { data, error } = await supabase
      .from('game_players')
      .select('*, users!inner(name), roles(*)')
      .eq('id', id)
      .single()
    if (error) return

    players.value.push(data)
  }
)

onBeforeMount(async () => {
  const { data, error } = await supabase
    .from('game_players')
    .select('*, users!inner(name), roles(*)')
    .eq('gameId', currentGameId.value)
    .order('id')
  if (error) return

  players.value = data
})

const assignRoles = (playersCount: number, rolesDistribution: GameRole[]) => {
  const roles = []
  for (const roleData of rolesDistribution) {
    for (let i = 0; i < roleData.count; i++) {
      roles.push(roleData.id)
    }
  }

  if (roles.length !== playersCount) {
    return null
  }

  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[roles[i], roles[j]] = [roles[j], roles[i]]
  }

  return roles
}

const setRoleForPlayers = async () => {
  if (!game.value || game.value.gameActive) return
  const assignedRoles = assignRoles(game.value.maxPlayers, game.value?.roles)
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
</script>

<template>
  <div>
    <div v-for="player in players" :key="player.id">
      {{ player.users.name }} - {{ player.roles?.title }}
    </div>
    <n-button class="my-5" @click="setRoleForPlayers">
      {{ players?.[0]?.roles ? 'Перераспределить' : 'Распределить ' }}
    </n-button>
  </div>
</template>

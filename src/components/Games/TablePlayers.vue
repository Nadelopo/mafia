<script setup lang="ts">
import { NTable } from 'naive-ui'
import { translatePlayerStatuses } from '../../shared/utils/translatePlayerStatuses'
import type { TablesRow } from '@/supabase/database.types'

type Player = TablesRow<'game_players'> & {
  users: Pick<TablesRow<'users'>, 'name'>
}

defineProps<{
  players: Player[]
}>()
</script>

<template>
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Имя</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="player in players" :key="player.id">
        <td>{{ player.users.name }}</td>
        <td>{{ translatePlayerStatuses[player.status] }}</td>
      </tr>
    </tbody>
  </n-table>
</template>

<style scoped></style>

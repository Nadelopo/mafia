import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import { useUserStore } from './userStore'

export const useGameStore = defineStore('game', () => {
  const game = ref<TablesRow<'games'> | null>(null)
  const isGameLoading = ref(true)
  const currentGameId = ref<number | null>(null)

  const { user } = storeToRefs(useUserStore())
  const isLeader = computed(
    () => user.value && game.value && user.value.id === game.value.leaderId
  )

  let controller = new AbortController()
  async function setGame(userId?: string) {
    controller.abort()
    controller = new AbortController()
    isGameLoading.value = true
    const [{ data: gameData }, { data: playerData }] = await Promise.all([
      supabase
        .from('games')
        .select()
        .match({ leaderId: userId })
        .abortSignal(controller.signal),
      supabase
        .from('game_players')
        .select('games!inner(*)')
        .match({ userId })
        .abortSignal(controller.signal)
    ])

    const gameExists = gameData?.[0]
    if (gameExists) {
      game.value = gameExists
      currentGameId.value = gameExists.id
    } else if (playerData) {
      currentGameId.value = playerData?.[0]?.games.id
      game.value = playerData?.[0]?.games
    } else {
      currentGameId.value = null
      game.value = null
    }

    isGameLoading.value = false
    return game.value
  }

  return { game, setGame, currentGameId, isGameLoading, isLeader }
})

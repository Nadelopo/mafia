import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TablesRow } from '@/supabase/database.types'
import { supabase } from '@/supabase'

export const useGameStore = defineStore('game', () => {
  const game = ref<TablesRow<'games'> | null>(null)
  const isGameLoading = ref(true)
  const currentGameId = ref(-1)

  function getGame(userId?: string) {
    return supabase.from('games').select().match({ leaderId: userId })
  }

  async function setGame(userId?: string) {
    isGameLoading.value = true

    const [{ data: gameData }, { data: playerData }] = await Promise.all([
      getGame(userId),
      supabase.from('game_players').select().match({ userId }).single()
    ])

    const gameExists = gameData?.[0]
    if (gameExists) {
      game.value = gameExists
      currentGameId.value = gameExists.id
    } else if (playerData) {
      currentGameId.value = playerData.gameId
      game.value = (await getGame(playerData.userId)).data?.[0] ?? null
    } else {
      currentGameId.value = -1
      game.value = null
    }

    isGameLoading.value = false
  }

  return { game, setGame, currentGameId, isGameLoading }
})

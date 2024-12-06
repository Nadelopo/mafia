import { onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import { useGameStore } from '@/stores/gameStore'

export const useConnectPlayersSubscription = (
  playersLength: () => number,
  callback: (id: number) => void
) => {
  const { currentGameId, game } = storeToRefs(useGameStore())

  const gamePlayersSubscription = supabase
    .channel('player-connection-tracking')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'game_players',
        filter: `gameId=eq.${currentGameId.value}`
      },
      async (payload) => {
        const player = payload.new as TablesRow<'game_players'>
        callback(player.id)
      }
    )
    .subscribe()

  watch(playersLength, (quantity) => {
    if (quantity === game.value?.maxPlayers) {
      gamePlayersSubscription.unsubscribe()
    }
  })

  onUnmounted(() => {
    gamePlayersSubscription.unsubscribe()
  })
}

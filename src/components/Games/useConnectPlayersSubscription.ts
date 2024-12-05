import { inject, onUnmounted, watch } from 'vue'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import { gameInjectionKey } from '@/views/Game/gameInjection'

export const useConnectPlayersSubscription = (
  playersLength: () => number,
  callback: (id: number) => void
) => {
  const { gameId, game } = inject(gameInjectionKey)!

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

import { onUnmounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import { useGameStore } from '@/stores/gameStore'

export const usePlayersSubscription = ({
  onPlayerConnect,
  onPlayerDisconnect
}: {
  onPlayerConnect?: (playerId: TablesRow<'game_players'>) => void
  onPlayerDisconnect?: (playerId: { id: number }) => void
}) => {
  const { currentGameId, game } = storeToRefs(useGameStore())

  const gamePlayersConnectSubscription = supabase
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
        onPlayerConnect?.(player)
      }
    )
    .subscribe()

  const gamePlayersDisconnectSubscription = supabase
    .channel('custom-delete-channel')
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'game_players' },
      (payload) => {
        const player = payload.old as { id: number }
        onPlayerDisconnect?.(player)
      }
    )
    .subscribe()

  watchEffect(() => {
    if (game.value?.gameActive) {
      gamePlayersConnectSubscription.unsubscribe()
      gamePlayersDisconnectSubscription.unsubscribe()
    }
  })

  onUnmounted(() => {
    gamePlayersConnectSubscription.unsubscribe()
    gamePlayersDisconnectSubscription.unsubscribe()
  })
}

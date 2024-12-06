import type { Enums } from '@/supabase/database.types'

export const translatePlayerStatuses: Record<
  Enums<'game_player_status'>,
  string
> = {
  killed: 'Убит',
  play: 'В игре',
  prison: 'В тюрьме'
}

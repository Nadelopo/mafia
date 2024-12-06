import type { InjectionKey, Ref } from 'vue'
import type { TablesRow } from '@/supabase/database.types'

type GameInjection = {
  game: Ref<TablesRow<'games'> | null>
  gameId: number
}

export const gameInjectionKey: InjectionKey<GameInjection> = Symbol('game')

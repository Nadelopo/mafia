import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'

export type UserStore = TablesRow<'users'>

export const useUserStore = defineStore('userStore', () => {
  const user = ref<UserStore | null>(null)

  async function setUser(id: string | undefined) {
    if (id !== undefined) {
      const { data } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single()

      user.value = data
    } else {
      user.value = null
    }
  }

  return {
    user,
    setUser
  }
})

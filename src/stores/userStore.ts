import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'
import type { User } from '@supabase/supabase-js'

export type UserStore = TablesRow<'users'>

export const useUserStore = defineStore('userStore', () => {
  const user = ref<UserStore | null>(null)

  async function setUser(id: string | undefined): Promise<void> {
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

  async function isUserAuthenticated(): Promise<User | null> {
    const sessionUser = (await supabase.auth.getSession()).data.session?.user
    return sessionUser ?? null
  }

  return {
    user,
    setUser,
    isUserAuthenticated
  }
})

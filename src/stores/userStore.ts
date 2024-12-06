import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { User } from '@supabase/supabase-js'
import type { TablesRow } from '@/supabase/database.types'

export type UserStore = TablesRow<'users'>

export const useUserStore = defineStore('userStore', () => {
  const user = ref<UserStore | null>(null)

  let controller = new AbortController()
  async function setUser(id: string | undefined): Promise<void> {
    if (user.value) return
    controller.abort()
    controller = new AbortController()
    if (id !== undefined) {
      const { data } = await supabase
        .from('users')
        .select()
        .abortSignal(controller.signal)
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

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NConfigProvider, darkTheme, NMessageProvider } from 'naive-ui'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'

const { setUser } = useUserStore()

const eventValue = ref('')
supabase.auth.onAuthStateChange(async (event, session) => {
  if (eventValue.value !== event) {
    setUser(session?.user.id)
    eventValue.value = event
  }
})

const router = useRouter()
const signOut = () => {
  supabase.auth.signOut()
  router.push({ name: 'Auth' })
}

const isRouterReady = ref(false)
router.isReady().then(() => (isRouterReady.value = true))
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <button
      v-if="isRouterReady && $route.name !== 'Auth'"
      class="ml-80"
      @click="signOut"
    >
      Выйти
    </button>
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>

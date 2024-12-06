<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NConfigProvider, darkTheme, NMessageProvider, NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from './stores/gameStore'

const { user } = storeToRefs(useUserStore())
const { setUser } = useUserStore()

const { setGame } = useGameStore()

watch(
  () => user.value?.id,
  (id) => setGame(id)
)

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
    <n-message-provider>
      <div class="container pb-6">
        <n-button
          v-if="isRouterReady && $route.name !== 'Auth'"
          @click="signOut"
        >
          Выйти
        </n-button>
      </div>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NConfigProvider, darkTheme, NMessageProvider } from 'naive-ui'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from './stores/gameStore'
import Header from './components/Header.vue'

const { user } = storeToRefs(useUserStore())
const { setUser } = useUserStore()

const { setGame } = useGameStore()
const { game } = storeToRefs(useGameStore())

watch(
  () => user.value?.id,
  (id) => setGame(id)
)

const router = useRouter()
watch(
  game,
  () => {
    if (!game.value) return
    router.push({ name: 'Game', params: { gameId: game.value.id } })
  },
  { once: true }
)

const eventValue = ref('')
supabase.auth.onAuthStateChange(async (event, session) => {
  if (eventValue.value !== event) {
    setUser(session?.user.id)
    eventValue.value = event
  }
})
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <Header />
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import { supabase } from '@/supabase'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const signOut = () => {
  supabase.auth.signOut()
  router.push({ name: 'Auth' })
}

const isRouterReady = ref(false)
router.isReady().then(() => (isRouterReady.value = true))

const { isLeader, game, isGameLoading } = storeToRefs(useGameStore())
const { setGame } = useGameStore()

const { user } = storeToRefs(useUserStore())
const quit = async () => {
  if (!user.value) return
  await supabase.from('game_players').delete().eq('userId', user.value.id)
  await setGame()
  router.push({ name: 'Welcome' })
}

const isShowQuitBtn = computed(
  () => !isGameLoading.value && game.value && !game.value.gameActive
)
</script>

<template>
  <div class="container pb-6 flex justify-between">
    <n-button v-if="isRouterReady && $route.name !== 'Auth'" @click="signOut">
      Выйти из аккаунта
    </n-button>
    <!-- {{ game }} -->
    <n-button v-if="isShowQuitBtn" @click="quit">
      {{ isLeader ? 'Распустить игру' : 'Выйти из игры' }}
    </n-button>
  </div>
</template>

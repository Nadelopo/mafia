<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NInput, NInputGroup, useMessage } from 'naive-ui'
import { supabase } from '@/supabase'
import { onlyAllowNumber } from '@/shared/utils/onlyAllowNumber'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'

const gameCode = ref('')

const onPaste = async () => {
  try {
    gameCode.value = await navigator.clipboard.readText()
  } catch (err) {
    console.error(err)
  }
}

const { game, currentGameId, isGameLoading } = storeToRefs(useGameStore())

const { user } = storeToRefs(useUserStore())
const message = useMessage()
const router = useRouter()

const goToGame = (gameId: string | number) =>
  router.push({ name: 'Game', params: { gameId } })

const connectToGame = async () => {
  if (!user.value) return

  const { data: game, error } = await supabase
    .from('games')
    .select(' leaderId')
    .eq('id', gameCode.value)
    .single()
  if (error) {
    return message.error('Игра не найдена')
  }

  if (game.leaderId === user.value.id) {
    return goToGame(gameCode.value)
  }

  const { error: createPlayerError } = await supabase
    .from('game_players')
    .insert({
      gameId: Number(gameCode.value),
      status: 'play',
      userId: user.value.id
    })

  if (createPlayerError) {
    if (createPlayerError.code === '23505') {
      message.warning('Вы уже в игре')
      const { data: player } = await supabase
        .from('game_players')
        .select('gameId')
        .eq('userId', user.value.id)
        .single()
      if (player) {
        goToGame(player.gameId)
      }
    }
    return
  }
  goToGame(gameCode.value)
}

const goOnCreatePage = async () => {
  if (!user.value) return
  const { data } = await supabase
    .from('games')
    .select()
    .eq('leaderId', user.value.id)
    .single()
  if (data) {
    message.warning('У вас уже есть игра')
    return goToGame(data.id)
  }
  router.push({ name: 'CreateGame' })
}
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-lvh">
    <h1 class="text-xl mb-10 text-center sm:text-2xl md:text-3xl">
      <div>Добро пожаловать в Мафию!</div>
      <div>Создай игру или присоединись к существующей!</div>
    </h1>
    <template v-if="!isGameLoading">
      <div v-if="game">
        <div class="my-6">
          У вас уже есть игра
          <n-button
            type="primary"
            class="ml-2"
            @click="
              router.push({ name: 'Game', params: { gameId: currentGameId } })
            "
          >
            войти
          </n-button>
        </div>
      </div>
      <div v-else class="content flex gap-6 flex-col md:flex-row">
        <div class="wrapper">
          <h2 class="head">Введите код, чтобы попасть в существующую игру</h2>
          <n-input-group>
            <n-input
              v-model:value="gameCode"
              type="text"
              :allow-input="onlyAllowNumber"
              placeholder="код"
              maxlength="10"
            />
            <n-button v-if="gameCode" type="primary" @click="connectToGame">
              Войти
            </n-button>
            <n-button v-else type="primary" @click="onPaste">
              Вставить
            </n-button>
          </n-input-group>
        </div>
        <div class="wrapper">
          <h2 class="head">Создайте свою игру, и пригласите друзей!</h2>
          <n-button type="primary" class="w-full" @click="goOnCreatePage">
            Создать
          </n-button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  border-radius: 10px;
  border: 2px solid var(--main-green);
  max-width: 300px;
  min-height: 160px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  .head {
    text-align: center;
    font-size: 18px;
    margin-top: 8px;
    margin-bottom: 16px;
  }
}
</style>

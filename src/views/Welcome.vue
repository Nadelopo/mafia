<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NInput, NInputGroup, useMessage } from 'naive-ui'
import { supabase } from '@/supabase'
import { onlyAllowNumber } from '@/shared/utils/onlyAllowNumber'

const roomCode = ref('')

const onPaste = async () => {
  try {
    roomCode.value = await navigator.clipboard.readText()
  } catch (err) {
    console.error(err)
  }
}

const message = useMessage()
const router = useRouter()
const connectToGame = async () => {
  const { error } = await supabase
    .from('games')
    .select('id')
    .eq('id', roomCode.value)
    .single()
  if (error) {
    return message.error('Комната не найдена')
  }
  router.push({ name: 'Game', params: { roomId: roomCode.value } })
}
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-lvh">
    <h1 class="text-xl mb-10 text-center sm:text-2xl md:text-3xl">
      <div>Добро пожаловать в Мафию!</div>
      <div>Создай комнату или присоединись к игре!</div>
    </h1>
    <div class="content flex gap-6 flex-col md:flex-row">
      <div class="wrapper">
        <h2 class="head">Введите код, чтобы попасть в существующую игру</h2>
        <n-input-group>
          <n-input
            v-model:value="roomCode"
            type="text"
            :allow-input="onlyAllowNumber"
            placeholder="код комнаты"
            maxlength="10"
          />
          <n-button v-if="roomCode" type="primary" @click="connectToGame">
            Войти
          </n-button>
          <n-button v-else type="primary" @click="onPaste"> Вставить </n-button>
        </n-input-group>
      </div>
      <div class="wrapper">
        <h2 class="head">Создайте свою комнату, и пригласите друзей!</h2>
        <n-button
          type="primary"
          class="w-full"
          @click="router.push({ name: 'CreateRoom' })"
        >
          Создать
        </n-button>
      </div>
    </div>
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

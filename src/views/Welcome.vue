<script setup lang="ts">
import { NButton, NInput, NInputGroup } from 'naive-ui'
import { onlyAllowNumber } from '@/shared/utils/onlyAllowNumber'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const roomCode = ref('')

const onPaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (onlyAllowNumber(text)) {
      roomCode.value = text
    }
  } catch (err) {
    console.error(err)
  }
}

const router = useRouter()
const goToRoom = () => {
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
          <n-button v-if="roomCode" type="primary" @click="goToRoom">
            Войти
          </n-button>
          <n-button v-else type="primary" @click="onPaste"> Вставить </n-button>
        </n-input-group>
      </div>
      <div class="wrapper">
        <h2 class="head">Создайте свою комнату, и пригласите друзей!</h2>
        <router-link :to="{ name: 'CreateRoom' }">
          <n-button type="primary" class="w-full"> Создать </n-button>
        </router-link>
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

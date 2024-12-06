<script setup lang="ts">
import { ref } from 'vue'
import type { TablesRow } from '@/supabase/database.types'
import { NImage } from 'naive-ui'

defineProps<{
  playerRole: TablesRow<'roles'> | null
}>()

const isCardOpen = ref(false)
const currentTurn = ref(0)

const toggleCard = () => {
  isCardOpen.value = !isCardOpen.value
}
</script>

<template>
  <div v-if="!playerRole">Ожидание распределения ролей...</div>
  <div v-else class="flex flex-col items-center">
    <div
      class="card-wrapper"
      :class="{ flipped: isCardOpen }"
      @click="toggleCard"
    >
      <div class="card front">
        <n-image
          width="100%"
          preview-disabled
          class="h-full"
          src="https://pmneozmbrbynumrlcqij.supabase.co/storage/v1/object/public/pictures/photo_2024-12-03_15-18-29%20(1).jpg"
        />
      </div>
      <div class="card back">
        <n-image
          width="100%"
          preview-disabled
          :src="playerRole.img"
          class="mb-5 h-96"
        />
        <p class="mb-2.5 text-2xl">{{ playerRole.title }}</p>
        <p>{{ playerRole.description }}</p>
      </div>
    </div>
    <p class="text-2xl mb-5">{{ currentTurn }} ход</p>
  </div>
</template>

<style scoped>
.card-wrapper {
  perspective: 1000px;
  width: 100%;
  height: 700px;
  position: relative;
  cursor: pointer;
  margin-bottom: 20px;
  max-width: 400px;
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition: transform 0.3s ease-in-out;
}

.card.front {
  transform: rotateY(0deg);
}

.card.back {
  transform: rotateY(180deg);
}

.card-wrapper.flipped .front {
  transform: rotateY(-180deg);
}

.card-wrapper.flipped .back {
  transform: rotateY(0deg);
}
</style>

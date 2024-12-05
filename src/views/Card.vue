<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { supabase } from '@/supabase'
import type { TablesRow } from '@/supabase/database.types'

const roles = ref<TablesRow<'roles'>[]>([])
const isCardOpen = ref(false)
const currentTurn = ref(0)

const toggleCard = () => {
  isCardOpen.value = !isCardOpen.value
}

onBeforeMount(async () => {
  const { data } = await supabase.from('roles').select()

  roles.value = data || []
})
</script>

<template>
  <div class="flex flex-col items-center">
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
      <div class="card back bg-neutral-200">
        <n-image
          width="100%"
          preview-disabled
          :src="roles?.[6]?.img"
          class="mb-5 h-96"
        />
        <p class="mb-2.5 text-2xl">{{ roles?.[1]?.title }}</p>
        <p>{{ roles?.[1]?.description }}</p>
      </div>
    </div>
    <p class="text-2xl mb-5">{{ currentTurn }} ход</p>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Роль</th>
          <th>Статус</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Влад</td>
          <td>Доктор</td>
          <td>В игре</td>
        </tr>
      </tbody>
    </n-table>
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

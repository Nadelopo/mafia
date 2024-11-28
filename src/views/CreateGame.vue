<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  NInput,
  NInputNumber,
  NForm,
  NFormItem,
  NSelect,
  NButton
} from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { useRouter } from 'vue-router'

type Role = { name: string; id: number; isRoleDark: boolean }

const playersCount = ref(9)

const data: Role[] = [
  { name: 'комисар', id: 1, isRoleDark: false },
  { name: 'доктор', id: 2, isRoleDark: false },
  { name: 'мафия', id: 0, isRoleDark: true },
  { name: 'путана', id: 3, isRoleDark: false },
  { name: 'маньяк', id: 4, isRoleDark: true }
]

const selectOptions: SelectMixedOption[] = data
  .sort((a, b) => Number(b.isRoleDark) - Number(a.isRoleDark))
  .map((e) => ({
    value: e.id,
    label: e.name
  }))

const roles = ref<(Role & { count: number })[]>([])
const onSelect = (rolesId: number[]) => {
  roles.value = rolesId
    .reduce<(Role & { count: number })[]>((acc, item) => {
      const currentRoly = roles.value.find((el) => el.id === item)
      if (currentRoly !== undefined) {
        acc.push(currentRoly)
        return acc
      }
      const role = data.find((el) => el.id === item)
      if (!role) return acc
      acc.push({ ...role, count: 1 })
      return acc
    }, [])
    .sort((a, b) => Number(b.isRoleDark) - Number(a.isRoleDark))
}

const getMaxCount = (id: number) => {
  const total = roles.value.reduce((sum, val) => {
    if (val.id !== id) {
      sum += val.count
    }
    return sum
  }, 0)

  return playersCount.value - total
}

const totalCountWithoutPeacefulInhabitant = computed(() =>
  roles.value.reduce((sum, val) => (sum += val.count), 0)
)

const isFormSubmitDisabled = computed(
  () => !playersCount.value || !roles.value.length
)

const onClear = async () => {
  await nextTick()
  playersCount.value = 0
}

const router = useRouter()
const onSubmit = () => {
  const gameId = Math.floor(Math.random() * 100000)
  router.push({ name: 'Game', params: { gameId } })
}
</script>

<template>
  <div class="flex flex-col items-center">
    <n-form
      class="w-80 flex flex-col justify-center"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl mb-4">Создайте свою игру</h1>
      <n-form-item path="playersCount" label="Количество игроков">
        <n-input-number
          v-model:value="playersCount"
          min="0"
          clearable
          placeholder=""
          class="w-full"
          @clear="onClear"
        />
      </n-form-item>

      <n-form-item>
        <n-select
          :disabled="playersCount === 0"
          :options="selectOptions"
          multiple
          placeholder="Выберите роли"
          @update:value="onSelect"
        />
      </n-form-item>

      <n-form-item v-for="role in roles" :key="role.id" :label="role.name">
        <n-input-number
          v-model:value="role.count"
          :max="getMaxCount(role.id)"
          min="1"
          class="w-full"
        />
      </n-form-item>
      <n-form-item v-if="roles.length" label="мирный житель">
        <n-input
          :value="String(playersCount - totalCountWithoutPeacefulInhabitant)"
          disabled
        />
      </n-form-item>

      <n-button
        :disabled="isFormSubmitDisabled"
        type="primary"
        attr-type="submit"
        class="mt-2"
      >
        Создать
      </n-button>
    </n-form>
  </div>
</template>

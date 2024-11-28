<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NInput,
  NInputNumber,
  NForm,
  NFormItem,
  NSelect,
  NButton,
  useThemeVars
} from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

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
    label: e.name,
    type: e.isRoleDark ? 'error' : 'success'
  }))

const roles = ref<(Role & { count: number })[]>([])
const onSelect = (rolesId: number[]) => {
  roles.value = rolesId.reduce<(Role & { count: number })[]>((acc, id) => {
    const existingRole = roles.value.find((role) => role.id === id)
    if (existingRole) {
      acc.push(existingRole)
      return acc
    }
    const role = data.find((el) => el.id === id)
    if (role) {
      acc.push({ ...role, count: 1 })
    }
    return acc
  }, [])
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

const onClearRoles = async () => {
  await nextTick()
  playersCount.value = 0
}

const router = useRouter()
const onSubmit = () => {
  const gameId = Math.floor(Math.random() * 100000)
  router.push({ name: 'Game', params: { gameId } })
}

const themeVars = useThemeVars()
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
          @clear="onClearRoles"
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

      <n-form-item
        v-for="role in roles"
        :key="role.id"
        :label="role.name"
        :label-style="{
          color: role.isRoleDark ? themeVars.errorColor : themeVars.successColor
        }"
      >
        <n-input-number
          v-model:value="role.count"
          :max="getMaxCount(role.id)"
          min="1"
          class="w-full"
        />
      </n-form-item>
      <n-form-item
        v-if="roles.length"
        label="мирный житель"
        :label-style="{ color: themeVars.successColor }"
      >
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

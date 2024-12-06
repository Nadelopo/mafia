<script setup lang="ts">
import { computed, nextTick, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  useThemeVars
} from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'
import type { TablesRow } from '@/supabase/database.types'

type Role = { title: string; id: number; isRoleDark: boolean }

const totalPlayers = ref(9)

const roles = ref<TablesRow<'roles'>[]>([])
const selectOptions = ref<SelectMixedOption[]>([])

onBeforeMount(async () => {
  const { data, error } = await supabase.from('roles').select()
  if (error) return
  roles.value = data
  selectOptions.value = data
    .filter((e) => e.id !== -1)
    .sort((a, b) => Number(b.isRoleDark) - Number(a.isRoleDark))
    .map((e) => ({
      value: e.id,
      label: e.title,
      type: e.isRoleDark ? 'error' : 'success'
    }))
})

const selectedRoles = ref<(Role & { count: number })[]>([])
const onSelect = (rolesId: number[]) => {
  selectedRoles.value = rolesId.reduce<(Role & { count: number })[]>(
    (acc, id) => {
      const existingRole = selectedRoles.value.find((role) => role.id === id)
      if (existingRole) {
        acc.push(existingRole)
        return acc
      }
      const role = roles.value.find((el) => el.id === id)
      if (role) {
        acc.push({ ...role, count: 1 })
      }
      return acc
    },
    []
  )
}

const getMaxCount = (id: number) => {
  const total = selectedRoles.value.reduce((sum, val) => {
    if (val.id !== id) {
      sum += val.count
    }
    return sum
  }, 0)

  return totalPlayers.value - total
}

const totalCountWithoutPeacefulInhabitant = computed(() =>
  selectedRoles.value.reduce((sum, val) => (sum += val.count), 0)
)

const isFormSubmitDisabled = computed(
  () => !totalPlayers.value || !selectedRoles.value.length
)

const onClearRoles = async () => {
  await nextTick()
  totalPlayers.value = 0
}

const router = useRouter()

const { user } = storeToRefs(useUserStore())
const onSubmit = async () => {
  if (!user.value) return

  const peacefulInhabitant = {
    count: totalPlayers.value - totalCountWithoutPeacefulInhabitant.value,
    id: -1
  }
  const { data, error } = await supabase
    .from('games')
    .insert({
      leaderId: user.value.id,
      maxPlayers: totalPlayers.value,
      roles: [
        ...selectedRoles.value.map((role) => ({
          id: role.id,
          count: role.count
        })),
        peacefulInhabitant
      ]
    })
    .select('id')
    .single()
  if (error) return
  router.push({ name: 'Game', params: { gameId: data.id } })
}

const themeVars = useThemeVars()
</script>

<template>
  <div class="flex flex-col items-center container">
    <n-form
      class="w-full flex flex-col justify-center"
      @submit.prevent="onSubmit"
    >
      <h1 class="text-2xl mb-4">Создайте свою игру</h1>
      <n-form-item path="playersCount" label="Количество игроков">
        <n-input-number
          v-model:value="totalPlayers"
          min="0"
          clearable
          placeholder=""
          class="w-full"
          @clear="onClearRoles"
        />
      </n-form-item>

      <n-form-item>
        <n-select
          :disabled="totalPlayers === 0"
          :options="selectOptions"
          multiple
          placeholder="Выберите роли"
          @update:value="onSelect"
        />
      </n-form-item>

      <n-form-item
        v-for="role in selectedRoles"
        :key="role.id"
        :label="role.title"
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
        v-if="selectedRoles.length"
        label="мирный житель"
        :label-style="{ color: themeVars.successColor }"
      >
        <n-input
          :value="String(totalPlayers - totalCountWithoutPeacefulInhabitant)"
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

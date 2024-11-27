<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue'
import {
  NInput,
  NInputNumber,
  NForm,
  NFormItem,
  NSelect,
  NButton,
  type FormInst,
  type FormRules,
  type FormItemRule
} from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'

type Role = { name: string; id: number }

interface Form {
  playersCount: number
  roles: number[]
}

const formRef = ref<FormInst | null>(null)
const form = ref<Form>({
  playersCount: 9,
  roles: []
})

const rules: FormRules = {
  players: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('Это поле обязательно для заполнения')
        }
        return true
      },
      trigger: ['input', 'blur']
    }
  ]
}

const data: Role[] = [
  { name: 'мафия', id: 0 },
  { name: 'комисар', id: 1 },
  { name: 'доктор', id: 2 },
  { name: 'путана', id: 3 },
  { name: 'маньяк', id: 4 }
]

const selectOptions: SelectMixedOption[] = data.map((e) => ({
  value: e.id,
  label: e.name
}))

const roles = ref<(Role & { count: number })[]>([])
watchEffect(() => {
  roles.value = form.value.roles.reduce<(Role & { count: number })[]>(
    (acc, item) => {
      const currentRoly = roles.value.find((el) => el.id === item)
      if (currentRoly !== undefined) {
        acc.push(currentRoly)
        return acc
      }
      const role = data.find((el) => el.id === item)
      if (!role) return acc
      acc.push({ ...role, count: 1 })
      return acc
    },
    []
  )

  // roles.value = []
})

const getMaxCount = (id: number) => {
  const total = roles.value.reduce((sum, val) => {
    if (val.id !== id) {
      sum += val.count
    }
    return sum
  }, 0)

  return form.value.playersCount - total
}

const totalCount = computed(() =>
  roles.value.reduce((sum, val) => (sum += val.count), 0)
)
const isFormSubmitDisabled = computed(() => {
  const isRolesNotAssigned =
    totalCount.value < form.value.playersCount ||
    totalCount.value > form.value.playersCount
  return form.value.playersCount === 0 || isRolesNotAssigned
})

const onClear = async () => {
  await nextTick()
  form.value.playersCount = 0
}
</script>

<template>
  <div class="flex flex-col items-center">
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      class="w-80 flex flex-col justify-center"
    >
      <h1 class="text-2xl mb-4">Создайте свою игру</h1>
      <n-form-item path="playersCount" label="Количество игроков">
        <n-input-number
          v-model:value="form.playersCount"
          min="0"
          clearable
          placeholder=""
          class="w-full"
          @clear="onClear"
        />
      </n-form-item>

      <n-form-item>
        <n-select
          v-model:value="form.roles"
          :disabled="form.playersCount === 0"
          multiple
          :options="selectOptions"
          placeholder="Выберите роли"
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
      <n-form-item label="мирный житель">
        <!-- <div class="w-36 text-base">мирный житель</div> -->
        <n-input :value="String(form.playersCount - totalCount)" disabled />
      </n-form-item>

      <n-button :disabled="isFormSubmitDisabled" type="primary" class="mt-2">
        Создать
      </n-button>
    </n-form>
  </div>
</template>

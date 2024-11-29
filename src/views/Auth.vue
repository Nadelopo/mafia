<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage, type FormInst } from 'naive-ui'
// import type { FormInst } from 'naive-ui'

// Ссылки и состояние

const isLoginMode = ref(true)
const formAuthRef = ref<FormInst | null>(null)
const formLoginRef = ref<FormInst | null>(null)
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('small')

// Данные формы
const formAuthValue = ref({
  email: '',
  name: '',
  password: ''
})

const formLoginValue = ref({
  email: '',
  password: ''
})

// Правила валидации
const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter a valid email',
      trigger: ['blur', 'input']
    }
  ],
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { min: 2, message: 'Name must be at least 2 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    {
      min: 6,
      message: 'Password must be at least 6 characters',
      trigger: ['blur', 'input']
    }
  ]
}

// Обработчик валидации
const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formAuthRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Valid')
    } else {
      console.log(errors)
      message.error('Invalid')
    }
  })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-lvh">
    <div v-if="isLoginMode">
      <n-form
        ref="formLoginRef"
        :label-width="80"
        :model="formLoginValue"
        :rules="rules"
        :size="size"
      >
        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="formLoginValue.email"
            :size="size"
            placeholder="Input Email"
          />
        </n-form-item>
        <n-form-item label="Пароль" path="password">
          <n-input
            v-model:value="formLoginValue.password"
            :size="size"
            placeholder="Phone Number"
          />
        </n-form-item>
        <n-form-item inline>
          <div class="flex flex-col w-full">
            <n-button
              type="primary"
              class="mr-3 w-full"
              @click="handleValidateClick"
            >
              Войти
            </n-button>
            <p class="mt-2 text-center">Нет аккаунта сучка ? тогда</p>
            <n-button type="primary" quaternary @click="(isLoginMode = false)">
              Регистрируйся
            </n-button>
          </div>
        </n-form-item>
      </n-form>
    </div>

    <div v-if="!isLoginMode">
      <n-form
        ref="formAuthRef"
        :label-width="80"
        :model="formAuthValue"
        :rules="rules"
        :size="size"
      >
        <n-form-item label="Email" path="email">
          <n-input
            v-model:value="formAuthValue.email"
            :size="size"
            placeholder="Input Email"
          />
        </n-form-item>
        <n-form-item label="Имя" path="name">
          <n-input
            v-model:value="formAuthValue.name"
            :size="size"
            placeholder="Input Name"
          />
        </n-form-item>
        <n-form-item label="Пароль" path="password">
          <n-input
            v-model:value="formAuthValue.password"
            :size="size"
            placeholder="Phone Number"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" class="mr-3" @click="handleValidateClick"
            >Регистрация
          </n-button>
          <p class="mr-1">или</p>
          <n-button type="primary" quaternary @click="(isLoginMode = true)"
            >Войти
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

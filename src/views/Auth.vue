<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  useMessage,
  NForm,
  NInput,
  NButton,
  NCard,
  NFormItem,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { supabase } from '@/supabase'

const isLoginMode = ref(true)
const formAuthRef = ref<FormInst | null>(null)
const message = useMessage()
const size = ref<'small' | 'medium' | 'large'>('small')

const formValue = ref({
  email: '',
  name: '',
  password: ''
})

const rules = computed<FormRules>(() => ({
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter a valid email',
      trigger: ['blur', 'input']
    }
  ],
  name: [
    {
      required: !isLoginMode.value,
      message: 'Name is required',
      trigger: 'blur'
    },
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
}))

const onSubmit = () => {
  formAuthRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Valid')
      auth(isLoginMode.value ? 'signIn' : 'signUp')
    } else {
      message.error('Invalid input')
    }
  })
}

const router = useRouter()
const auth = async (type: 'signUp' | 'signIn') => {
  if (type === 'signUp') {
    const { data, error } = await supabase.auth.signUp({
      email: formValue.value.email,
      password: formValue.value.password
    })

    if (error || !data.user) {
      console.error(error)
      message.error('Registration failed')
      return
    }

    const { error: insertError } = await supabase.from('users').insert({
      name: formValue.value.name,
      email: formValue.value.email,
      id: data.user.id
    })

    if (insertError) console.error(insertError)
  }

  if (type === 'signIn') {
    const { error } = await supabase.auth.signInWithPassword({
      email: formValue.value.email,
      password: formValue.value.password
    })

    if (error) {
      message.error('Login failed')
      return
    }
  }
  router.push({ name: 'Welcome' })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <n-card class="w-96">
      <transition name="fade" mode="out-in">
        <n-form
          ref="formAuthRef"
          :key="isLoginMode ? 'login-form' : 'signup-form'"
          :label-width="80"
          :model="formValue"
          :rules="rules"
          :size="size"
          @submit.prevent="onSubmit"
        >
          <n-form-item label="Email" path="email">
            <n-input
              v-model:value="formValue.email"
              :size="size"
              placeholder="Введите Email"
            />
          </n-form-item>

          <n-form-item v-if="!isLoginMode" label="Имя" path="name">
            <n-input
              v-model:value="formValue.name"
              :size="size"
              placeholder="Введите имя"
            />
          </n-form-item>

          <n-form-item label="Пароль" path="password">
            <n-input
              v-model:value="formValue.password"
              :size="size"
              placeholder="Введите пароль"
              type="password"
            />
          </n-form-item>

          <n-form-item>
            <n-button type="primary" attr-type="submit" class="w-full">
              {{ isLoginMode ? 'Войти' : 'Регистрация' }}
            </n-button>
          </n-form-item>

          <n-form-item class="flex items-center justify-center w-full">
            <div class="flex justify-center">
              <n-button
                quaternary
                round
                type="info"
                class="text-sm"
                @click="(isLoginMode = !isLoginMode)"
              >
                {{
                  isLoginMode
                    ? 'Нет аккаунта? Зарегистрируйтесь'
                    : 'Уже есть аккаунт? Войдите'
                }}
              </n-button>
            </div>
          </n-form-item>
        </n-form>
      </transition>
    </n-card>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

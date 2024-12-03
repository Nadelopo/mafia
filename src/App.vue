<script setup lang="ts">
import { ref } from 'vue'
import { NMessageProvider } from 'naive-ui'
import { supabase } from '@/supabase'
import { useUserStore } from '@/stores/userStore'

const { setUser } = useUserStore()

const eventValue = ref('')
supabase.auth.onAuthStateChange(async (event, session) => {
  if (eventValue.value !== event) {
    setUser(session?.user.id)
    eventValue.value = event
  }
})
</script>

<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<style scoped></style>

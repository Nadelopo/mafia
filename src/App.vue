<script setup lang="ts">
import { ref } from 'vue'
import { NConfigProvider, darkTheme, NMessageProvider } from 'naive-ui'
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
  <n-config-provider :theme="darkTheme">
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>

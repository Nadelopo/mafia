<script setup lang="ts">
import Layout from '@/Components/Layout.vue'
import { supabase } from '@/supabase'
import { ref } from 'vue'
import {useUserStore} from '@/stores/userStore'

const { setUser} = useUserStore()

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
    <layout>
      <router-view />
    </layout>
  </n-message-provider>
</template>

<style scoped></style>

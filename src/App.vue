<script setup>
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import BottomNavbar from './components/bottomNavbar.vue'
import TopNavbar from './components/topNavbar.vue'

const userStore = useUserStore()
const showNavbar = computed(() => userStore.isAuthenticated)

// Fetch profile when app starts
onMounted(async () => {
  if (userStore.isAuthenticated) {
    await userStore.fetchProfile()
  }
})
</script>

<template>
  <TopNavbar v-if="showNavbar" />

  <router-view />

  <BottomNavbar v-if="showNavbar" />
</template>

<template>
 <v-app-bar app height="40" elevation="2">
    <small class="ml-2">Olá, {{ AuthStore.user?.name }}</small>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
// import { NavBarLeft } from '@/components/NavBarLeft.vue';
const AuthStore = useAuthStore();
</script>

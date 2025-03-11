<template>

  <v-layout app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="email@gmailcom"
          :title="user?.name"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-cash-clock" title="Pagamentos" to="/pagamentos" ></v-list-item>
        <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
        <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="height: 250px">
      <slot name="content"></slot>
    </v-main>

  </v-layout>


</template>
<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { computed } from 'vue';

  const AuthStore = useAuthStore();
  const user = computed(() => AuthStore.user);



</script>

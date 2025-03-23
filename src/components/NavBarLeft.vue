<template>

  <v-layout app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <!-- <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="email@gmailcom"
          :title="user?.name"></v-list-item> -->
          <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="user?.name"></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-cash-register" title="Pagamentos" to="/pagamentos" ></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Alunos" to="/alunos"></v-list-item>
        <v-list-item prepend-icon="mdi-notebook-outline " title="Agendamentos" to="/agenda"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pa-4">
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

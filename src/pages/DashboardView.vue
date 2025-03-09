<template>
  <v-conteiner class="border border-warning">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Dashboard</v-card-title>
          <v-card-text>
            <p>Olá, {{authStore.user?.name}}</p>
            <p>Seja bem vindo ao Dashboard</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-conteiner>

</template>


<script setup>
import {useAuthStore} from "@/stores/auth.js";
const authStore = useAuthStore()






</script>



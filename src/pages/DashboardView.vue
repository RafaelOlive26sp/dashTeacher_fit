<template>
  <v-conteiner>
    <v-row>
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Dashboard</v-card-title>
          <v-card-text>
            <v-btn @click="handleLogout" color="primary" block>Logout</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-conteiner>
</template>


<script setup>
import {useAuthStore} from "@/stores/auth.js";
import {useRouter} from "vue-router";

const authStore = useAuthStore()
const router = useRouter()



const handleLogout = async () => {
  try{
    await authStore.logout()
    router.push('/login')
  }catch (error) {
    console.error('Error ao fazer o Logout ',error)
  }
}


</script>



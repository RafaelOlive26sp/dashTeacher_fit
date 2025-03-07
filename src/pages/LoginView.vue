<template>
  <v-container class="fill-height">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field v-model="userEmail" label="Email" required></v-text-field>
              <v-text-field v-model="userPassword" label="Password" type="password" required></v-text-field>
              <v-btn type="submit" color="primary" block>Login</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="showError" color="error">
    Erro ao fazer login. Verifique suas credenciais e tente novamente.
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showError = false">Fechar</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {useAuthStore} from '@/stores/auth.js'
import {login as loginApi} from '@/services/auth.js'


const userEmail = ref('')
const userPassword = ref('')
const router = useRouter()
const authStore = useAuthStore()
const showError = ref(false)

const handleLogin = async () => {
  try {
      const response = await loginApi({email: userEmail.value, password: userPassword.value})
      authStore.login(response)
      router.push('/')
  } catch (error) {
    console.error(error)
    showError.value = true
  }
}


</script>

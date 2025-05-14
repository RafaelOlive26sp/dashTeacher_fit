<template >
  <v-app>
    <v-main class="login-animated-background">
      <v-container class="fill-height">
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title>Login</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="userEmail"
                    label="Email"
                    required
                    :rules="[rules.required, rules.email]"
                  />
                  <v-text-field
                    v-model="userPassword"
                    label="Password"
                    type="password"
                    required
                    :rules="[rules.required, rules.password]"
                  />
                    <v-btn
                    type="submit"
                    color="primary"
                    block
                    :disabled="!userEmail || !userPassword"
                    >
                    Login
                    </v-btn>
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
    </v-main>
  </v-app>
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
const rules = {
  required: v => !!v || 'Campo Obrigatorio',
  email: v => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(v) || 'E-mail inválido';
    },
  password: v => {
      const pattern = /^.{6,}$/; //
      return pattern.test(v) || `Senha deve ter pelo menos 6 caracteres.`;
    },
}

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

<style scoped>
.login-animated-background {
  background: linear-gradient(-45deg, #1e1e1e, #2c3e50, #34495e, #1e1e1e);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  min-height: 100vh;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>


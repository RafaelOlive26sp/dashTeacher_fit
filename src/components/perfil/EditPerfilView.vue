<template>
  <v-container class="py-10" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4" class="rounded-xl pa-6" color="#1e1e1e">
          <v-card-title class="text-h5 text-white">
            Minha Conta
          </v-card-title>

          <v-card-subtitle class="text-white mb-6">
            Atualize suas informações de perfil, foto e preferências.
          </v-card-subtitle>

          <!-- FOTO DE PERFIL -->
          <v-row class="align-center mb-6" justify="center">
            <v-avatar size="100">
              <v-img :src="profilePreview || defaultAvatar" />
            </v-avatar>
          </v-row>
          <v-row justify="center" class="mb-4">
            <v-btn size="small" @click="triggerFileInput" color="primary" variant="outlined">
              Trocar Foto
            </v-btn>
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" hidden />
          </v-row>

          <!-- FORMULÁRIO -->
          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="form.name"
              label="Nome"
              variant="outlined"
              color="primary"
              class="mb-4"
              hide-details
              dense
            />

            <v-text-field
              v-model="form.email"
              label="E-mail"
              variant="outlined"
              color="primary"
              class="mb-4"
              hide-details
              dense
              disabled
            />

            <v-text-field
              v-model="form.password"
              label="Nova Senha"
              type="password"
              variant="outlined"
              color="primary"
              class="mb-4"
              hide-details
              dense
            />

            <!-- PREFERÊNCIA DE NOTIFICAÇÃO -->
            <v-switch
              v-model="form.receiveEmails"
              label="Receber notificações por e-mail"
              color="primary"
              class="mb-4"
            />

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
            >
              Salvar Alterações
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: 'Admin Rafael',
  email: 'admin@example.com',
  password: '',
  receiveEmails: true
})

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png' // imagem de perfil padrão
const profilePreview = ref(null)

const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      profilePreview.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function handleSubmit() {
  console.log('Dados enviados:', form.value)
}
</script>

<style scoped>
.v-card {
  background-color: #1e1e1e;
  color: white;
}
</style>

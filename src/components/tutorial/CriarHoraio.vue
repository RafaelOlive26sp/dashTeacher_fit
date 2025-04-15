<template>
  <div>
    <!-- Diálogo de tutorial -->
    <v-dialog v-model="showTutorial" max-width="600" persistent>
      <v-card class="bg-grey-darken-4 text-grey-lighten-2 rounded-lg">
        <v-card-title class="text-h6 text-white">
          🕒 Como criar horários para as turmas
        </v-card-title>

        <v-card-text>
          <ul class="ml-4 mt-2">
            <li class="mb-1">Escolha uma <strong>turma</strong> disponível.</li>
            <li class="mb-1">Clique em <strong>"Adicionar Horário"</strong>no desenho de Mais.</li>
            <li class="mb-1">Selecione o <strong>dia da semana</strong>, <strong>horário de início</strong> e
              <strong>fim</strong>.</li>
            <li class="mb-1">Confirme para salvar o novo horário da turma.</li>
          </ul>
          <p class="mt-3">
            Os horários criados serão exibidos na lista e ficarão disponíveis para os alunos agendarem suas aulas.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="orange-darken-2" variant="flat" @click="fecharTutorial">
            Entendi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Botão flutuante de ajuda -->
    <v-btn icon class="position-fixed" :class="{ 'animate-pulse': primeiraVez }"
      style="bottom: 24px; right: 24px; z-index: 1000;" color="orange-darken-2" @click="abrirTutorial">
      <v-icon>mdi-help-circle</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showTutorial = ref(false)
const primeiraVez = ref(false)

onMounted(() => {
  const jaViuTutorial = localStorage.getItem('tutorialCriarHorario')
  if (!jaViuTutorial) {
    primeiraVez.value = true
    showTutorial.value = true
  }
})

function fecharTutorial() {
  localStorage.setItem('tutorialCriarHorario', 'true')
  showTutorial.value = false
  primeiraVez.value = false
}

function abrirTutorial() {
  showTutorial.value = true
}
</script>

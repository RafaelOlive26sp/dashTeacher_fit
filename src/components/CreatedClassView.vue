<template>
  <v-card>


    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field v-model="classData.name" label="Nome da Turma" :rules="[rules.required]" required />

        <v-text-field v-model.number="classData.max_students" label="Máximo de Alunos" type="number"
          :rules="[rules.required, rules.positive]" required />

        <v-select v-model="classData.level" label="Nível da Turma" :items="levels" item-title="label" item-value="value"
          :rules="[rules.required]" required />
      </v-form>
    </v-card-text>

    <v-card-actions class="justify-end">
      <!--      <v-btn text @click="dialog = false">Cancelar</v-btn>-->
      <v-btn color="primary" @click="submit" :disabled="!valid">
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>

  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>
  <TutorialView v-model="showTutorial" title="Como criar uma turma">
    <template v-slot:contentTutorial>
      <ul class="ml-4 mt-2">
        <li class="mb-1">Escolha um <strong>nome</strong> para a turma.</li>
        <li class="mb-1">Defina o <strong>máximo de alunos</strong> que podem se inscrever.</li>
        <li class="mb-1">Selecione o <strong>nível</strong> da turma.</li>
        <li class="mb-1">Clique em <strong>"Salvar"</strong> para criar a turma.</li>
      </ul>
      <p class="mt-3">
        As turmas criadas serão exibidas na lista e ficarão disponíveis para os alunos agendarem suas aulas.
      </p>
    </template>
  </TutorialView>
</template>

<script setup>
import { ref } from 'vue'
import { createdClass as createdClassApi } from '@/services/user.js'
import { useUserStore } from '@/stores/user.js'
import SnackBarsView from "@/components/snackBar/SnackBarsView.vue";
import TutorialView from "@/components/tutorial/TutorialView.vue";
import { handleError } from '@/utils/ErrorHandle';

const userStore = useUserStore()
const emit = defineEmits(['close'])
const valid = ref(false)

const form = ref(null)

const classData = ref({
  name: '',
  max_students: null,
  level: ''
})

const levels = [
  { label: 'Iniciante', value: 'beginner' },
  { label: 'Intermediário', value: 'intermediate' },
  { label: 'Avançado', value: 'advanced' },
]

const rules = {
  required: v => !!v || 'Campo obrigatório',
  positive: v => v > 0 || 'Deve ser maior que 0'
}

const snackbarMessage = ref('')
const snackbar = ref(false)

const submit = () => {
  form.value?.validate()

  if (valid.value) {


    // Aqui você pode emitir um evento ou enviar para API
    const dataToSend = {
      name: classData.value.name,
      max_students: classData.value.max_students,
      level: classData.value.level
    }
    // Exemplo de envio de dados
    const createClass = async () => {
      try {
        // Aqui você pode fazer uma chamada para a API para criar a turma
        const response = await createdClassApi(dataToSend)
        // console.log('Resposta da API:', response)
        await userStore.loadCreatedClass(response)
        snackbarMessage.value = response.message
        snackbar.value = true
        setTimeout(() => {

          emit('close');
        }, 2000);
        userStore.shouldRefreshSchedules = true
      } catch (error) {
        handleError('Erro ao criar turma:', error)
      }
      finally {
        clearInputs()
      }
    }
    createClass()
  }
}
const clearInputs = () => {
  classData.value.name = ''
  classData.value.max_students = null
  classData.value.level = ''
}
</script>


<style scoped></style>

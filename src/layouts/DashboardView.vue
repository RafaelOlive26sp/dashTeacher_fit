<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" md="6" lg="4">
        <v-select
          v-model="filtroNivel"
          :items="[
            { title: 'Todas', value: 'todos' },
            { title: 'Iniciante', value: 'beginner' },
            { title: 'Intermediário', value: 'intermediate' },
            { title: 'Avançado', value: 'advanced' },
          ]"
          label="Filtrar por Nível"
          variant="outlined"
          density="compact"
        />
        <v-btn
          class="me-2 mt-2 mt-md-0"
          prepend-icon="mdi-pencil"
          rounded="lg"
          text="Editar Turmas"
          @click="openDialog(item, 'created')"
          block
        ></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4" color="#1e1e1e" variant="flat">
          <h2 class="text-h6 text-white mb-2">
            💪 Sistema de Agendamentos de Treinamento Funcional
          </h2>
          <p class="text-body-2 text-grey-lighten-1">
            Bem-vindo(a) ao nosso sistema! Aqui você encontra a organização completa das turmas de treinamento
            funcional, separadas por nível (iniciante, intermediário, avançado), horários disponíveis e informações dos
            alunos participantes.
          </p>
          <p class="text-body-2 text-grey-lighten-1 mt-2">
            Use o filtro acima para visualizar apenas as turmas de um nível específico. Mantenha-se organizado e
            acompanhe todos os detalhes com facilidade!
          </p>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="turma in turmasFiltradas"
        :key="turma.id"
        cols="12"
        md="6"
      >
        <v-card class="mb-4 pa-3" elevation="5" rounded="xl">
          <v-card-title
            class="py-2 px-4 d-flex justify-space-between align-center"
            :class="corPorNivel(turma.classe.level)"
            style="font-size: 1rem;"
          >
            <span>{{ turma.classe.name }} ({{ turma.classe.level }})</span>
          </v-card-title>
          <v-card-text class="pt-2">
            <strong>Horários:</strong>
            <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
              <li v-for="(pattern, index) in turma.classe.schedules_patterns" :key="index">
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>

            <strong>Alunos:</strong>
            <v-row>
              <v-col
                v-for="aluno in turma.students"
                :key="aluno.id"
                cols="12"
                sm="6"
                class="d-flex"
              >
                <v-card outlined class="pa-3 flex-grow-1">
                  <div style="font-size: 0.9rem;">
                    <strong>Nome:</strong> {{ aluno.name }} <br />
                    <strong>Idade:</strong> {{ aluno.age }} <br />
                    <strong>Sexo:</strong> {{ aluno.gender }} <br />
                    <strong>Condição Médica:</strong> {{ aluno.medical_condition }}<br />
                    <strong>Pagamento:</strong> {{ aluno.payments.length > 0 ? aluno.payments[0].status : 'Não pago' }}
                  </div>
                </v-card>
              </v-col>

              <v-col v-if="turma.students.length === 0" cols="12">
                <v-alert type="info" density="compact" border="start" class="mt-2">
                  Nenhum aluno cadastrado.
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <Dialog v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm">
    <EditClassesView @updateClass="getDataClsSchedule" />
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getDataScheduleCls as getDataScheduleClsServicesApi } from '@/services/user.js'
import { useUserStore } from '@/stores/user.js'
import EditClassesView from '@/components/EditClasses/EditClassesView.vue'
import Dialog from '@/components/Dialogs.vue'

const userStore = useUserStore()
const filtroNivel = ref('todos')
const dialogVisible = ref(false)
const dialogTitle = ref('')

onMounted(async () => {
  getDataClsSchedule()
  userStore.triggerNavBarRefresh()
})
const dataScheduleStore = ref([])

watch(
  () => userStore.dataScheduleStoreUsersClass,
  (newValue) => {
    if (newValue && Array.isArray(newValue.data)) {
      dataScheduleStore.value = newValue.data
    } else {
      dataScheduleStore.value = []
    }
  },
  { immediate: true }
)
const turmasFiltradas = computed(() => {
  if (!Array.isArray(dataScheduleStore.value)) return []

  const agrupadas = {}

  for (const aluno of dataScheduleStore.value) {
    for (const matricula of aluno.classes) {
      const turma = matricula.classe
      const turmaId = turma.id

      if (!agrupadas[turmaId]) {
        agrupadas[turmaId] = {
          id: turmaId,
          classe: turma,
          students: []
        }
      }

      agrupadas[turmaId].students.push({
        id: aluno.id,
        name: aluno.user.name,
        age: aluno.age,
        gender: aluno.gender,
        medical_condition: aluno.medical_condition,
        payments: aluno.payments ?? [],
      })
    }
  }

  const turmas = Object.values(agrupadas)

  if (filtroNivel.value === 'todos') return turmas
  return turmas.filter(t => t.classe.level === filtroNivel.value)
})

const corPorNivel = (level) => {
  switch (level) {
    case 'beginner':
      return 'bg-blue-darken-1 text-white'
    case 'intermediate':
      return 'bg-green-darken-1 text-white'
    case 'advanced':
      return 'bg-red-darken-1 text-white'
    default:
      return ''
  }
}

const getDataClsSchedule = async () => {
  try {
    const response = await getDataScheduleClsServicesApi()
    await userStore.getDataScheduleStore(response)
  } catch (e) {
    console.log(e)
  }
}
const openDialog = () => {
  dialogVisible.value = true
}
</script>

<style scoped>
/* Responsividade extra para mobile */
@media (max-width: 600px) {
  .v-card-title {
    font-size: 0.95rem !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .v-card-text {
    font-size: 0.95rem !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
  .v-btn {
    width: 100% !important;
    margin-top: 8px !important;
  }
  .v-select {
    min-width: 0 !important;
    width: 100% !important;
  }
  .v-col {
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
  ul {
    margin-left: 1rem !important;
  }
}
</style>

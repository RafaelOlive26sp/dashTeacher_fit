<!-- <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Instancia o router para navegação
const router = useRouter();

// Estado para o botão de ação
const isProfessor = ref(true); // Pode ser ajustado com base na autenticação do usuário

// Funções de navegação
const goToStudents = () => router.push('/alunos');
const goToPayments = () => router.push('/pagamentos');
const goToProfileCreation = () => router.push('/alunos');
</script>

<template>
  <v-container class="dashboard-container">

    <v-row justify="center" class="text-center">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold primary--text">
          Bem-vindo ao Seu Sistema de Gestão!
        </h1>
        <p class="text-subtitle-1 mt-2">
          Gerencie seus alunos de Educação Física e Bem-Estar com facilidade.
        </p>
      </v-col>
    </v-row>


    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4 elevation-3">
          <v-card-title class="text-h6">
            <v-icon left color="primary">mdi-account-group</v-icon>
            Gerencie Seus Alunos
          </v-card-title>
          <v-card-text>
            Crie perfis para seus alunos, acompanhe o progresso deles e mantenha tudo organizado em um só lugar. Caso um aluno precise de ajuda, você pode criar o perfil por ele!
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="goToProfileCreation">
              Criar Perfil de Aluno
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 elevation-3">
          <v-card-title class="text-h6">
            <v-icon left color="primary">mdi-cash-register</v-icon>
            Agende Pagamentos
          </v-card-title>
          <v-card-text>
            Programe os pagamentos dos seus alunos de forma simples e prática. Tenha controle total sobre as finanças das suas aulas.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="goToPayments">
              Agendar Pagamento
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" class="text-center">
        <v-alert type="info" outlined>
          <span class="font-weight-medium">
            Comece agora! Explore as ferramentas e simplifique sua rotina como professor.
          </span>
        </v-alert>
        <v-btn
          color="primary"
          large
          class="mt-4"
          @click="goToStudents"
        >
          Ver Lista de Alunos
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style> -->

<!-- <script setup>
import { ref, computed, onMounted } from 'vue';

const turmas = ref([]);
const filtro = ref('');
const nivelSelecionado = ref('Todos');

const dadosFicticios = [
  {
    id: 1,
    name: 'Turma A',
    level: 'Iniciante',
    schedules_patterns: [
      { day_of_week: 'Segunda-feira', start_time: '07:00', end_time: '08:00' },
      { day_of_week: 'Quarta-feira', start_time: '16:00', end_time: '17:00' },
      { day_of_week: 'Sexta-feira', start_time: '20:00', end_time: '21:00' }
    ],
    alunos: [
      { id: 1, name: 'João Silva', start_date: '2025-04-22', status: 'Presente', extra_classes: [] },
      { id: 2, name: 'Ana Costa', start_date: '2025-04-22', status: 'Ausente', extra_classes: [] }
    ]
  },
  {
    id: 2,
    name: 'Turma B',
    level: 'Intermediário',
    schedules_patterns: [
      { day_of_week: 'Terça-feira', start_time: '09:00', end_time: '10:00' },
      { day_of_week: 'Quinta-feira', start_time: '14:00', end_time: '15:00' }
    ],
    alunos: [
      { id: 3, name: 'Maria Souza', start_date: '2025-04-21', status: 'Presente', extra_classes: [] }
    ]
  }
];

onMounted(() => {
  turmas.value = dadosFicticios;
});

const corPorNivel = level => {
  switch (level) {
    case 'Iniciante': return 'blue-lighten-4';
    case 'Intermediário': return 'orange-lighten-4';
    case 'Avançado': return 'purple-lighten-4';
    default: return 'grey-lighten-3';
  }
};

const turmasFiltradas = computed(() => {
  let filtradas = turmas.value;

  if (nivelSelecionado.value !== 'Todos') {
    filtradas = filtradas.filter(t => t.level === nivelSelecionado.value);
  }

  if (filtro.value) {
    filtradas = filtradas.map(turma => ({
      ...turma,
      alunos: turma.alunos.filter(aluno =>
        aluno.name.toLowerCase().includes(filtro.value.toLowerCase())
      )
    })).filter(turma =>
      turma.name.toLowerCase().includes(filtro.value.toLowerCase()) ||
      turma.alunos.length > 0
    );
  }

  return filtradas;
});
</script>

<template>
  <v-container fluid class="dashboard-container dark-section">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="filtro"
          label="Buscar turma ou aluno"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          dense
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="nivelSelecionado"
          :items="['Todos', 'Iniciante', 'Intermediário', 'Avançado']"
          label="Filtrar por nível"
          prepend-inner-icon="mdi-filter-variant"
          variant="outlined"
          dense
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="turma in turmasFiltradas"
        :key="turma.id"
        cols="12"
      >
        <v-card
          class="mb-8"
          elevation="4"
          rounded="xl"
          :class="corPorNivel(turma.level)"
        >
          <v-card-title class="bg-grey-darken-3 text-white d-flex justify-space-between align-center">
            <div>
              <v-icon left>mdi-account-group</v-icon>
              {{ turma.name }} — {{ turma.level }}
            </div>
            <v-chip color="deep-purple-accent-4" class="text-white" label>
              {{ turma.alunos.length }} Aluno(s)
            </v-chip>
          </v-card-title>

          <v-card-text>
            <strong>Horários:</strong>
            <ul class="ml-4 mb-4">
              <li
                v-for="(pattern, index) in turma.schedules_patterns"
                :key="index"
              >
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-subtitle-1 mb-3">Alunos:</h3>

            <v-row>
              <v-col
                v-for="aluno in turma.alunos"
                :key="aluno.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card class="pa-3" elevation="2" rounded="lg">
                  <v-card-title class="text-wrap d-flex align-center">
                    <v-icon left color="indigo">mdi-account</v-icon>
                    {{ aluno.name }}
                  </v-card-title>
                  <v-card-text>
                    <div><strong>Início:</strong> {{ aluno.start_date }}</div>
                    <div class="mt-2 d-flex align-center">
                      <strong>Status:</strong>
                      <v-chip
                        :color="aluno.status === 'Presente' ? 'green' : 'red'"
                        class="ml-2"
                        small
                        label
                      >
                        <v-icon left small>
                          {{ aluno.status === 'Presente' ? 'mdi-check-circle' : 'mdi-close-circle' }}
                        </v-icon>
                        {{ aluno.status }}
                      </v-chip>
                    </div>
                    <div v-if="aluno.extra_classes.length" class="mt-2">
                      <strong>Aulas Extras:</strong>
                      <ul class="ml-4">
                        <li
                          v-for="(extra, index) in aluno.extra_classes"
                          :key="index"
                        >
                          {{ extra.date }} — {{ extra.start_time }} às {{ extra.end_time }} ({{ extra.status }})
                        </li>
                      </ul>
                    </div>
                    <div v-else class="mt-2">
                      <em>Sem aulas extras.</em>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.dark-section {
  background-color: #1e1e2f;
  color: #f5f5f5;
  border-radius: 12px;
}
</style> -->



<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" md="6" lg="4">
        <v-select v-model="filtroNivel" :items="[
          { title: 'Todas', value: 'todos' },
          { title: 'Iniciante', value: 'beginner' },
          { title: 'Intermediário', value: 'intermediate' },
          { title: 'Avançado', value: 'advanced' },
        ]" label="Filtrar por Nível" variant="outlined" density="compact" />
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
    <!-- {{filtroNivel}} -->

    <v-row>
      <v-col v-for="turma in turmasFiltradas" :key="turma.id" cols="12" md="6">
        <v-card class="mb-4 pa-3" elevation="5" rounded="xl">
          <v-card-title class="py-2 px-4 d-flex justify-space-between align-center"
            :class="corPorNivel(turma.classe.level)" style="font-size: 1rem;">
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
              <v-col v-for="aluno in turma.students" :key="aluno.id" cols="12" sm="6">
                <v-card outlined class="pa-3 h-100">
                  <div style="font-size: 0.9rem;">
                    <strong>Nome:</strong> {{ aluno.name }} <br />
                    <strong>Idade:</strong> {{ aluno.age }} <br />
                    <strong>Sexo:</strong> {{ aluno.gender }} <br />
                    <strong>Condição Médica:</strong> {{ aluno.medical_condition }}
                    <strong>Pagamento:</strong>{{ aluno.payments.length > 0 ? aluno.payments[0].status : 'Não pago' }}
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getDataScheduleCls as getDataScheduleClsServicesApi } from '@/services/user.js'
import { useUserStore } from '@/stores/user.js'


const userStore = useUserStore()
const filtroNivel = ref('todos')

onMounted(() => {

  getDataClsSchedule()

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
    console.log('estamos dentro da funcao getDataCls ', response)
    await userStore.getDataScheduleStore(response)
  } catch (e) {
    console.log(e)
  }
}
</script>

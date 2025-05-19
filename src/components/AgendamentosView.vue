<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="6" class="mb-1 ">  
        <v-sheet elevation="3" class="pa-4">
          <v-item-group v-model="selectedClasses" mandatory>
            <v-item :value="turma" v-for="turma in classSchedules" :key="turma.id" v-slot="{ isSelected, toggle }">
              <!-- {{turma}} -->

              <v-card :color="isSelected ? 'primary' : ''" cols="12" sm="6" md="4"  class="ma-2 pa-4" elevation="3"
                @click="handleApoointment(turma, toggle, 'turma')" hover>
                <v-card-title class="text-h6">{{ turma.name }}</v-card-title>
                <!-- {{turma}} -->
                <!-- Marca d'água "Sem Aluno" -->
                <div v-if="turma.students.length === 0" class="position-absolute text-grey-lighten-1 text-center"
                  style="top: 55%; left: 35%; transform: translate(-50%, -50%); opacity: 0.2; font-size: 1.5rem;">
                  Sem Aluno
                </div>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3" class="mb-2">
                      <div><strong>Nível:</strong> {{ levelLabel(turma.level) }}</div>
                      <div><strong>Máx. alunos:</strong> {{ turma.max_students }}</div>
                      <div><strong>Qtd. alunos:</strong> {{ turma.students?.length }}</div>
                      <div><strong>Criada em:</strong> {{ formatDate(turma.created_at) }}</div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" class="mb-2">
                      <strong>Horários:</strong>
                      <ul class="pl-4">
                        <li v-for="(schedule, index) in turma.schedules_patterns" :key="index">
                          {{ translateDay(schedule.day_of_week) }} -
                          {{ schedule.start_time.slice(0, 5) }} às
                          {{ schedule.end_time.slice(0, 5) }}
                        </li>
                        <p v-if="turma.schedules_patterns.length === 0">Sem Horarios.</p>

                      </ul>
                    </v-col>

                  </v-row>
                </v-card-text>
              </v-card>
            </v-item>
          </v-item-group>
        </v-sheet>
      </v-col>
      <divider></divider>


      <v-col cols="12" sm="6" md="4" lg="5" class="mb-2 ">
        <v-sheet elevation="3" class="pa-4">
          <v-item-group v-model="selectedUsers">
            <v-item v-for="user in paymentConfirmed" :key="user.id" v-slot="{ isSelected, toggle }">
              <v-card :color="isSelected ? 'success' : ''" class="ma-2 pa-4" elevation="3"
                @click="handleApoointment(user, toggle, 'user')" hover v-if="user.classes.length === 0">
                <v-card-title class="text-h6">{{ user.user.name }}</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3" class="mb-1">
                      <div>Idade: {{ user.age }} anos</div>
                      <div>Altura: {{ user.height }}m</div>
                      <div>Peso: {{ user.weight }}kg</div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="3" class="mb-1">
                      <div>Gênero: {{ user.gender === 'male' ? 'Masculino' : 'Feminino' }}</div>
                      <div>Condição médica: {{ user.medical_condition || 'Nenhuma' }}</div>
                      <div>Status Pagamento: {{ user.payments[0].status === 'paid' ? 'Pago' : 'Pendente' }}</div>
                    </v-col>
                  </v-row>


                </v-card-text>
              </v-card>

            </v-item>
          </v-item-group>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>

  <dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm" persistent="persistent">
    <ResumoAgendamentoView :data="dataAppointment" @confirmar="dialogVisible = false" @recarregar="handleRecarregar">
    </ResumoAgendamentoView>
  </dialogs>
  <TutorialView title="Agendamentos" :show="userStore.showTutorial">
    <template v-slot:contentTutorial>
      <div class="tutorial-content">
        <p><strong>1. Selecione uma turma:</strong> Escolha uma turma disponível na lista para iniciar o agendamento.
        </p>
        <p><strong>2. Selecione um aluno:</strong> Apenas alunos com pagamento confirmado estarão disponíveis para
          seleção.</p>
        <p><strong>3. Confirme o agendamento:</strong> Após selecionar a turma e o aluno, clique no botão <v-btn
            color="primary" small>Confirmar Agendamento</v-btn> para confirmar.</p>
        <p><strong>4. Cancelamento:</strong> Você pode cancelar o agendamento a qualquer momento, caso necessário.</p>
        <v-alert type="info" class="mt-4">
          <strong>Dica:</strong> Se nenhum aluno estiver disponível, verifique o status de pagamento dos alunos.
        </v-alert>
      </div>
    </template>
    <template #actions>
      <v-btn @click="userStore.showTutorial = false">Fechar</v-btn>
    </template>

  </TutorialView>


</template>

<script setup>





import { ref, computed, onMounted, watch } from 'vue';
import {
  loadClasses as loadClassesApi,
  getStudentsWithClass as getStudentsWithClassApi,
} from '@/services/user.js'
import { useUserStore } from '@/stores/user.js';
import { format } from 'date-fns';
import Dialogs from "@/components/Dialogs.vue";
import ResumoAgendamentoView from "@/components/ResumoAgendamentoView.vue";
import TutorialView from "@/components/tutorial/TutorialView.vue";


const userStore = useUserStore();

// Modifique a estrutura para garantir o carregamento correto

const classSchedules = ref([]);
const users = ref([]);
// const selectedSchedule = ref(null);
const selectedUsers = ref([]);
const selectedClasses = ref(null);
const dataUser = ref('');
const dataTurma = ref('');
const snackbarMessage = ref('');
const snackbar = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dataAppointment = [
  {
    user: '',
    turma: ''
  }
]





// Simulando carregamento assíncrono
onMounted(async () => {
  // Substitua por sua chamada API real
  // await loadData();
  await loadDataClasses();
  await getStudents();
});

watch(
  () => userStore.shouldRefreshSchedules,
  async (newValue) => {
    if (newValue) {
      await loadDataClasses();
      userStore.shouldRefreshSchedules = false;

    }
  }
);

const handleRecarregar = (dados) => {
  loadDataClasses()
  getStudents()
  // console.log('handleRecarregar ',dados.cancelado)
  if (dados?.cancelado) {
    dialogVisible.value = false
    snackbarMessage.value = 'Agendamento cancelado com sucesso';
    snackbar.value = true;
    selectedUsers.value = []
    selectedClasses.value = null
    dataUser.value = ''
    dataTurma.value = ''
  } else {
    snackbarMessage.value = 'Agendamento realizado com sucesso';
    snackbar.value = true;
  }

}

const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    // console.log('Dados passados para store', response.data);
    await userStore.loadDataSchedules(response)
    classSchedules.value = response.data

  } catch (error) {
    console.log(error);

  }
}

const getStudents = async () => {
  try {
    const response = await getStudentsWithClassApi();
    userStore.getStudentsWithUser(response);
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

const handleApoointment = (data, toggle, type) => {
  toggle()

  if (type === 'user') {
    dataUser.value = data
  }
  if (type === 'turma') {
    dataTurma.value = data
  }



  if (!dataTurma.value || !dataUser.value ||
    (Array.isArray(dataTurma.value) && !dataTurma.value.length) ||
    (Array.isArray(dataUser.value) && !dataUser.value.length)
  ) {
    // snackbarMessage.value = 'Selecione uma turma e um aluno para continuar';
    // snackbar.value = true;
    return;
  }

  // dataAppointment = {
  //    user: dataUser.value,
  //    turma: dataTurma.value
  //  }
  dataAppointment[0].user = dataUser.value
  dataAppointment[0].turma = dataTurma.value
  dialogVisible.value = true
  dialogTitle.value = 'Resumo do Agendamento'

}


const translateDay = (day) => {
  if (!day) {
    return 'Dia inválido';
  }

  const days = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  return days[day.toLowerCase()] || day;
};

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

const paymentConfirmed = computed(() => {
  // console.log('users.value', users.value);
  // console.log('users.value.filter', users.value.filter(u => u.payments?.some(p => p.status === 'paid')));

  return users.value.filter(u => u.payments?.some(p => p.status === 'paid'))
});

const levelLabel = (level) => {
  switch (level) {
    case 'beginner':
      return 'Básico';
    case 'intermediate':
      return 'Intermediário';
    case 'advanced':
      return 'Avançado';
    default:
      return 'Nível desconhecido';
  }
}

</script>

<style scoped>
.v-expansion-panel {
  margin-bottom: 8px;
  border-radius: 8px !important;
}

.v-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.v-card:hover {
  transform: scale(1.02);
}

.time-badge {
  font-size: 0.8em;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>

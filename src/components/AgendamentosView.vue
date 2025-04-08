<template>
  <v-container>
    <v-row>

      <!-- Coluna de Agendamentos Agrupados -->

      <!-- <v-col cols="12" md="8">

        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="group in classSchedules" :key="group.id">

            <v-expansion-panel-title :class="selectedGroupId === group.id ? 'bg-primary text-white' : ''"
              @click="selectGroup(group.id)">
              {{ group.name }} ({{ group.level }}) - Max Alunos: {{ group.max_students }}
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-row dense>
                <v-col v-for="schedule in group.schedules_patterns" :key="schedule.id" cols="12" md="6">
                  <v-card   class="ma-1 pa-3"
  color="grey-lighten-4"
  elevation="2" hover>
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <strong>{{ translateDay(schedule?.day_of_week) }}</strong>
                        <div class="text-caption">
                          {{ schedule.start_time }} - {{ schedule.end_time }}
                        </div>
                      </div>
                      <v-icon :color="selectedSchedule === schedule.id ? 'white' : 'primary'">
                        {{ selectedSchedule === schedule.id ? 'mdi-checkbox-marked-circle' : 'mdi-clock-outline' }}
                      </v-icon>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-divider class="my-6" />

        <v-card>
          <v-card-title>
            Aulas Extras
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <v-col v-for="extra in extraClasses" :key="extra.id" cols="12" md="6">
                <v-card :color="selectedSchedule === extra.id ? 'secondary' : 'background'" class="ma-1 pa-3"
                  elevation="2" @click="toggleScheduleSelection(extra.id)" hover>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <strong>{{ translateDay(extra.day_of_week) }}</strong>
                      <div class="text-caption">
                        {{ extra.start_time }} - {{ extra.end_time }}
                      </div>
                    </div>
                    <v-icon :color="selectedSchedule === extra.id ? 'white' : 'secondary'">
                      {{ selectedSchedule === extra.id ? 'mdi-checkbox-marked-circle' : 'mdi-clock-outline' }}
                    </v-icon>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>


      </v-col> -->

      <v-col cols="12" md="8">
        <v-sheet elevation="3" class="pa-4">
          <v-item-group v-model="selectedClasses" mandatory>
            <v-item :value="turma" v-for="turma in classSchedules" :key="turma.id" v-slot="{ isSelected, toggle }">

              <v-card :color="isSelected ? 'primary' : ''" class="ma-2 pa-3" @click="handleApoointment(turma, toggle,'turma')" hover>
                <v-card-title>{{ turma.name }}</v-card-title>

                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <div><strong>Nível:</strong> {{ levelLabel(turma.level) }}</div>
                      <div><strong>Máx. alunos:</strong> {{ turma.max_students }}</div>
                      <div><strong>Criada em:</strong> {{ formatDate(turma.created_at) }}</div>
                    </v-col>
                    <v-col cols="6">
                      <div><strong>Horários:</strong></div>
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


      <v-col cols="12" md="4">
        <v-sheet elevation="3" class="pa-4">
          <v-item-group v-model="selectedUsers" >
            <v-item v-for="user in paymentConfirmed" :key="user.id" v-slot="{ isSelected, toggle }">
              <v-card :color="isSelected ? 'success' : ''" class="ma-2 pa-3" @click="handleApoointment(user, toggle, 'user')" hover v-if="user.classes.length === 0">
                <v-card-title>{{ user.user.name }}</v-card-title>



                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <div>Idade: {{ user.age }} anos</div>
                      <div>Altura: {{ user.height }}m</div>
                      <div>Peso: {{ user.weight }}kg</div>
                    </v-col>
                    <v-col cols="6">
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

  <dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm" >
      <ResumoAgendamentoView :data="dataAppointment" @confirmar="dialogVisible = false"></ResumoAgendamentoView>
  </dialogs>


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


const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    // console.log('Dados passados para store', response.data);
    userStore.loadDataSchedules(response)
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

const handleApoointment = (data, toggle, type)=>{
  toggle()

      if(type === 'user'){
         dataUser.value  = data
      }
      if (type === 'turma'){
        dataTurma.value = data
      }



  if (!dataTurma.value || !dataUser.value ||
    (Array.isArray(dataTurma.value) && !dataTurma.value.length) ||
    (Array.isArray(dataUser.value) && !dataUser.value.length)
  ) {
    snackbarMessage.value = 'Selecione uma turma e um aluno para continuar';
    snackbar.value = true;
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

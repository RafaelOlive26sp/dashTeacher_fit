<template>
  <v-container>
    <v-row>
      <!-- Coluna de Agendamentos Agrupados -->
      <v-col cols="12" md="8">

        <v-expansion-panels variant="accordion">
          <v-expansion-panel v-for="(group, date) in groupedSchedules" :key="date" :title="formatGroupHeader(date)">
            <v-expansion-panel-text>
              <v-row dense>
                <v-col v-for="schedule in group" :key="schedule.id" cols="12" md="6">
                  <v-card :color="selectedSchedule === schedule.id ? 'primary' : 'background'" class="ma-1 pa-3"
                    elevation="2" @click="toggleScheduleSelection(schedule.id)" hover>

                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <strong>{{ schedule.start_time }} - {{ schedule.end_time }}</strong>
                        <!-- {{ schedule }} -->
                        <div class="text-caption">
                          {{ schedule.classes_id.name }} ({{ schedule.classes_id.level }})
                          <br>
                          <p>Max Alunos: {{ schedule.classes_id.max_students }}</p>
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

      </v-col>

      <!-- Coluna de Alunos Selecionados -->
      <v-col cols="12" md="4">
        <v-sheet elevation="3" class="pa-4">
          <v-item-group v-model="selectedUsers" multiple>
            <v-item v-for="user in paymentConfirmed" :key="user.id" v-slot="{ isSelected, toggle }">
              <v-card :color="isSelected ? 'success' : ''" class="ma-2 pa-3" @click="toggle" hover>
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
                      <div>Status Pagamento: {{ user.payment[0].status === 'paid' ? 'Pago' : 'Pendente' }}</div>
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
</template>

<script setup>





import { ref, computed, onMounted } from 'vue';
import {
  loadClasses as loadClassesApi,
  getStudentsWithUser as getStudentsWithUserApi,
} from '@/services/user.js'
import { useUserStore } from '@/stores/user.js';
import { format, parseISO } from 'date-fns'

const userStore = useUserStore();

// Modifique a estrutura para garantir o carregamento correto
const classes = ref([]);
const classSchedules = ref([]);
const users = ref([]);
// const users = ref([]);

// Simulando carregamento assíncrono
onMounted(async () => {
  // Substitua por sua chamada API real
  // await loadData();
  await loadDataClasses();
  await getStudents();
});



const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    console.log('Dados passados para store', response);
    userStore.loadDataSchedules(response)
    classSchedules.value = response.data

  } catch (error) {
    console.log(error);

  }
}



// const users = ref([
//   { id: 1, name: 'Aluno 1', email: 'aluno1@email.com' },
//   { id: 2, name: 'Aluno 2', email: 'aluno2@email.com' },
//   // ... outros alunos
// ]);


// Adicione segurança na busca de classes
const getClassInfo = (classId) => {
  return classes.value.find(c => c.id === classId) || {
    name: 'Turma não encontrada',
    level: 'N/A'
  };
};
const getStudents = async () => {
  try {
    const response = await getStudentsWithUserApi();
    userStore.getStudentsWithUser(response);
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};


// Agrupar horários por data
const groupedSchedules = computed(() => {
  const groups = {};
  classSchedules.value.forEach(schedule => {
    const key = schedule.date;
    console.log('Key de dentro do forEach ', key);
    console.log('Antes do if', groups[key]);

    if (!groups[key]) {
      groups[key] = [];
      console.log('dentro no if ', groups[key])
    }
    groups[key].push({
      ...schedule,
      class: getClassInfo(schedule.class_id) // Usando a função segura
    });
  });
  console.log('returno para a view ', groups);
  return groups;
});




// Função para formatar o cabeçalho do grupo
const formatGroupHeader = (dateString) => {
  return format(parseISO(dateString), 'dd/MM/yyyy');
};

// Mantido o mesmo estado e métodos de seleção
const selectedSchedule = ref(null);
const selectedUsers = ref([]);

const toggleScheduleSelection = (scheduleId) => {
  selectedSchedule.value = selectedSchedule.value === scheduleId ? null : scheduleId;
};

const paymentConfirmed = computed(() => {
  return users.value.filter(u => u.payment.some(p => p.status === 'paid'))
});

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

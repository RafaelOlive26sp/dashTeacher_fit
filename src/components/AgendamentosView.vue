<template>
  <v-container>
    <v-row>

      <!-- Coluna de Agendamentos Agrupados -->

      <v-col cols="12" md="8">

        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="group in classSchedules"
            :key="group.id"
          >
            <v-expansion-panel-title>
              {{ group.name }} ({{ group.level }}) - Max Alunos: {{ group.max_students }}
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-row dense>
                <v-col
                  v-for="schedule in group.schedules_patterns"
                  :key="schedule.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    :color="selectedSchedule === schedule.id ? 'primary' : 'background'"
                    class="ma-1 pa-3"
                    elevation="2"
                    @click="toggleScheduleSelection(schedule.id)"
                    hover
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <strong>{{ translateDay(schedule.day_of_week) }}</strong>
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
              <v-col
                v-for="extra in extraClasses"
                :key="extra.id"
                cols="12"
                md="6"
              >
                <v-card
                  :color="selectedSchedule === extra.id ? 'secondary' : 'background'"
                  class="ma-1 pa-3"
                  elevation="2"
                  @click="toggleScheduleSelection(extra.id)"
                  hover
                >
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


      </v-col>

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
</template>

<script setup>





import { ref, computed, onMounted } from 'vue';
import {
  loadClasses as loadClassesApi,
  getStudentsWithUser as getStudentsWithUserApi,
} from '@/services/user.js'
import { useUserStore } from '@/stores/user.js';


const userStore = useUserStore();

// Modifique a estrutura para garantir o carregamento correto

const classSchedules = ref([]);
const users = ref([]);
const selectedSchedule = ref(null);
const selectedUsers = ref([]);



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
    console.log('Dados passados para store', response.data);
    userStore.loadDataSchedules(response)
    classSchedules.value = response.data

  } catch (error) {
    console.log(error);

  }
}

const getStudents = async () => {
  try {
    const response = await getStudentsWithUserApi();
    userStore.getStudentsWithUser(response);
    users.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};


const toggleScheduleSelection = (id) => {
  selectedSchedule.value = selectedSchedule.value === id ? null : id;
};


const translateDay = (day) => {
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

const paymentConfirmed = computed(() => {
  return users.value.filter(u => u.payments?.some(p => p.status === 'paid'))
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

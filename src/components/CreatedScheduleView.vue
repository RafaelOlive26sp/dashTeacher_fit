<template>
  <v-col cols="12" sm="6" md="4" lg="12" class="mb-3">
    <v-sheet elevation="3" class="pa-4">
      <v-item-group v-model="selectedClasses">
        <v-item :value="turma" v-for="turma in classSchedules" :key="turma.id" v-slot="{ isSelected, toggle }">

          <v-card :color="isSelected ? 'primary' : ''" class="ma-2 pa-3" @click="toggle" hover>
            <v-card-title>{{ turma.name }}</v-card-title>


            <v-fab :active="isSelected" icon="mdi-plus" class="fab-overlap fab-edit" absolute
              @click="openDialog(turma.id, 'createClass')">

            </v-fab>


            <v-fab :active="isSelected" icon="mdi-text-box-edit" class="fab-overlap fab-add " absolute
              @click="openDialog(turma.id, 'editClass')" v-if="turma.schedules_patterns.length > 0">

            </v-fab>

            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4" lg="3" class="mb-4">
                  <div><strong>Nível:</strong> {{ levelLabel(turma.level) }}</div>
                  <div><strong>Máx. alunos:</strong> {{ turma.max_students }}</div>
                  <div><strong>Criada em:</strong> {{ formatDate(turma.created_at) }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3" class="mb-2">
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

  <Dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm">
    <Schedules :class-id="selectedItem" @close="dialogVisible = false" @refresh-data="loadDataClasses"
      v-if="actionType === 'createClass'">
      >

    </Schedules>
  </Dialogs>
  <tutorial v-model="showTutorial"  />


</template>
<script setup>
import { ref, onMounted } from 'vue';
import { loadClasses as loadClassesApi } from '@/services/user';
import { format } from 'date-fns'
import Dialogs from './Dialogs.vue';
import Schedules from './SchedulesView.vue';
import tutorial from './tutorial/CriarHoraio.vue';
import { handleError } from '@/utils/ErrorHandle';

const classSchedules = ref([]);
const selectedClasses = ref([]);
// const hidden = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref("Criar Turmas")
const selectedItem = ref(null)
const actionType = ref("")
const dialogActionText = ref("Criar")
const showTutorial = ref(false)


onMounted(() => {

  loadDataClasses()
})



const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    classSchedules.value = response.data
  } catch (error) {
    handleError(error);

  }
}
const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

const openDialog = (item, type) => {
  selectedItem.value = item;
  actionType.value = type;
  dialogVisible.value = true
  if (type === 'createClass') {
    dialogActionText.value = "Criar"
    selectedItem.value = item
    // console.log('Criar', item);
  }
}

const levelLabel = (level) => {
  switch (level) {
    case 'basic':
      return 'Básico';
    case 'intermediate':
      return 'Intermediário';
    case 'advanced':
      return 'Avançado';
    default:
      return 'Nível desconhecido';
  }
}

const translateDay = (day) => {
  const days = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  }
  return days[day] || day
}






</script>

<style scoped>
.fab-edit {
  position: absolute;
  top: -2px;
  right: 1px;
  z-index: 10;
}

.fab-add {
  position: absolute;
  top: -52px;
  right: 1px;
  z-index: 10;
}
</style>

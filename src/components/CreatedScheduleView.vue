<template>

  <v-col cols="12" md="8">
    <v-sheet elevation="3" class="pa-4">
      <v-item-group v-model="selectedClasses">
        <v-item :value="turma" v-for="turma in classSchedules" :key="turma.id" v-slot="{ isSelected, toggle }">

          <v-card :color="isSelected ? 'primary' : ''" class="ma-2 pa-3" @click="toggle" hover>
            <v-card-title>{{ turma.name }}</v-card-title>

            <v-fab :active="isSelected" icon="mdi-plus" class="fab-overlap fab-edit" absolute @click="openDialog(item, 'createClass')"></v-fab>
            <v-fab :active="isSelected" icon="mdi-text-box-edit" class="fab-overlap fab-add " absolute @click="openDialog(item, 'editClass')"></v-fab>

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
    <CreatedSchedulesView>

    </CreatedSchedulesView>
  </Dialogs>


</template>
<script setup>
import { ref, onMounted } from 'vue';
import { loadClasses as loadClassesApi } from '@/services/user';
import { format } from 'date-fns'
import Dialogs from './Dialogs.vue';
import CreatedSchedulesView from './CreatedSchedulesView.vue';

const classSchedules = ref([]);
const selectedClasses = ref([]);
// const hidden = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref("Criar Turmas")
const selectedItem = ref(null)
const actionType = ref("")


onMounted(() => {

  loadDataClasses()
})



const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    classSchedules.value = response.data
  } catch (error) {
    console.log(error);

  }
}
const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

const openDialog = (item, type) => {
  selectedItem.value = item;
  actionType.value = type;
  dialogVisible.value = true
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

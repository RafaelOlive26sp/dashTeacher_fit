<template>
  <v-container>
    <h1 class="text-center mb-4">Agendamento de Aulas</h1>

    <v-row>
      <v-col cols="12" md="6">
        <h2 class="mb-2">Turmas Disponíveis</h2>
        <v-row>
          <v-col v-for="classGroup in classGroups" :key="classGroup.id" cols="12" md="4">
            <v-sheet elevation="3" class="pa-2">
              <v-card :color="selectedClass === classGroup.id ? 'primary' : ''"
                      :subtitle="classGroup.level" :title="classGroup.name"
                      @click="selectClass(classGroup)" class="cursor-pointer">
                <p>Dias: {{ classGroup.days }}</p>
                <p>Capacidade: {{ classGroup.capacity }} alunos</p>
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <h2 class="mb-2">Seleção de Alunos</h2>
        <v-row>
          <v-col v-for="user in users" :key="user.id" cols="12" md="4">
            <v-sheet elevation="3" class="pa-2">
              <v-card :color="selectedUsers.includes(user) ? 'success' : ''"
                      :subtitle="user.email" :title="user.name"
                      @click="toggleUserSelection(user)" class="cursor-pointer">
              </v-card>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-btn class="mt-4" color="primary" @click="showDialog = true">Agendar Aula</v-btn>

    <v-dialog v-model="showDialog" max-width="500">
      <v-card>
        <v-card-title>Agendar Aula</v-card-title>
        <v-card-text>
          <v-text-field v-model="date" label="Data da Aula" type="date"></v-text-field>
          <v-select v-model="selectedSchedule" label="Horário" :items="schedules" item-title="time" item-value="id"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="showDialog = false">Cancelar</v-btn>
          <v-btn color="green" @click="scheduleClass">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const classGroups = ref([
  { id: 1, name: 'Turma 1', capacity: 5, days: 'Segunda-feira, Terça-feira', level: 'Intermediate' },
  { id: 2, name: 'Turma 2', capacity: 3, days: 'Segunda-feira, Quarta-feira', level: 'Intermediate' },
  { id: 3, name: 'Turma 3', capacity: 3, days: 'Segunda-feira, Quinta-feira, Sexta-feira', level: 'Beginner' },
]);

const schedules = ref([
  { id: 1, time: '08:30 - 09:30' },
  { id: 2, time: '15:00 - 16:00' },
  { id: 3, time: '19:20 - 20:20' },
]);

const users = ref([
  { id: 1, name: 'João Silva', email: 'joao@email.com' },
  { id: 2, name: 'Maria Oliveira', email: 'maria@email.com' },
  { id: 3, name: 'Carlos Souza', email: 'carlos@email.com' },
]);

const selectedUsers = ref([]);
const selectedClass = ref(null);
const selectedSchedule = ref(null);
const showDialog = ref(false);
const date = ref('');

const toggleUserSelection = (user) => {
  const index = selectedUsers.value.findIndex(u => u.id === user.id);
  if (index === -1) {
    selectedUsers.value.push(user);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const selectClass = (classGroup) => {
  selectedClass.value = classGroup.id;
};

const scheduleClass = () => {
  console.log({
    date: date.value,
    class_id: selectedClass.value,
    schedule_id: selectedSchedule.value,
    users: selectedUsers.value
  });
  showDialog.value = false;
};
</script>

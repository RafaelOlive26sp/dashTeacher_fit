<template>
  <v-col cols="12" md="8">
    <v-sheet elevation="3" class="pa-4">
      <v-item-group v-model="selectedClasses" multiple>
        <v-item v-for="turma in classSchedules" :key="turma.id" v-slot="{ isSelected, toggle }">
          <v-card :color="isSelected ? 'primary' : ''" class="ma-2 pa-3" @click="toggle" hover>
            <v-card-title>{{ turma.name }}</v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div><strong>Nível:</strong> {{ levelLabel(turma.level) }}</div>
                  <div><strong>Máx. alunos:</strong> {{ turma.max_students }}</div>
                </v-col>
                <v-col cols="6">
                  <div><strong>Criada em:</strong> {{ formatDate(turma.created_at) }}</div>
                  <div><strong>Atualizada:</strong> {{ formatDate(turma.updated_at) }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-item>
      </v-item-group>
    </v-sheet>
  </v-col>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { loadClasses as loadClassesApi } from '@/services/user';
const classSchedules = ref([])

onMounted(async () => {
  await loadDataClasses();
})


const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    classSchedules.value = response.data
  } catch (error) {
    console.log(error);

  }
}





</script>

<template>
  <pre>

    {{ turmasSemEstudantes }}
  </pre>
   <v-container fluid>


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
  <!-- {{ props.dataSchedules }} -->
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CardTurmasView from '@/components/CardTurmas/CardTurmasView.vue'

const filtroNivel = ref('todos')
const dataScheduleStore = ref([])
const props = defineProps({
  dataSchedules:{
    Object
  }
})

watch(() => props.dataSchedules, (newValue) => {
  dataScheduleStore.value = newValue
}, { immediate: true })

import {loadClasses} from '@/services/user.js'

// const userStore = useUserStore()
const allClassSchedules = ref([])
onMounted(async () => {
  const response = await loadClasses()
  if (response) {
    // allClassSchedules.value = response.data
    allClassSchedules.value = response.data.filter(turma => turma.students.length === 0);


  }


})


const turmasFiltradas = computed(() => {


  if (!Array.isArray(dataScheduleStore.value)) return []

  const agrupadas = {}

  for (const aluno of dataScheduleStore.value) {
    console.log('Alunos ',aluno);

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
</script>

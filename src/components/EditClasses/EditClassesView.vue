<template>
  <v-container fluid>
      <v-row>
         <v-col v-for="turma in turmasFiltradas" :key="turma.id" cols="12" md="6">
           <v-card class="mb-4 pa-3" elevation="5" rounded="xl">
             <v-card-title class="py-2 px-4 d-flex justify-space-between align-center"
               :class="corPorNivel(turma.classe.level)" style="font-size: 1rem;">
               <span>{{ turma.classe.name }} ({{ turma.classe.level }})</span>
             </v-card-title>

             <v-card-text class="pt-2">
               <!-- Horários -->
               <strong>Horários:</strong>
               <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
                 <li
                   v-for="(pattern, index) in turma.classe.schedules_patterns"
                   :key="index"
                 >
                   {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
                 </li>
               </ul>

               <strong>Alunos:</strong>


<!--                {{// turma.classe}}-->
             <draggable
               :list="turma.students"
               group="alunos"
               item-key="id"
               class="d-flex flex-wrap"
               :animation="200"
               :data-turma-id="turma.id"
               @end="(evt) => onDrop(turma, evt)"
             >
               <template #item="{ element }">
                 <v-col cols="12" sm="6">
                   <v-card outlined class="pa-3 ma-1">
                     <div style="font-size: 0.9rem;">
                       <strong>Nome:</strong> {{ element.name }}<br />
                       <strong>Idade:</strong> {{ element.age }}<br />
                       <strong>Sexo:</strong> {{ element.gender }}<br />
                       <strong>Experiência:</strong> {{ element.experience_level }}
                     </div>
                   </v-card>
                 </v-col>
               </template>
             </draggable>


             </v-card-text>
           </v-card>
         </v-col>
      </v-row>


     <!-- Turmas sem alunos -->
    <!-- Turmas sem alunos -->
    <v-row class="mt-6">
      <v-col
        v-for="turma in allClassSchedules"
        :key="`sem-aluno-${turma.id}`"
        cols="12"
        md="6"
      >
        <v-card class="mb-4 pa-3" elevation="2" rounded="xl">
          <v-card-title
            class="py-2 px-4 d-flex justify-space-between align-center"
            :class="corPorNivel(turma.level)"
            style="font-size: 1rem;"
          >
            <span>{{ turma.name }} ({{ turma.level }})</span>
          </v-card-title>

          <v-card-text class="pt-2">
            <strong>Horários:</strong>
            <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
              <li
                v-for="(pattern, index) in turma.schedules_patterns"
                :key="index"
              >
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>

            <!-- Draggable com drop funcional -->
            <draggable
              :list="turma.students"
              group="students"
              item-key="id"
              class="d-flex flex-wrap"
              :animation="200"
              :data-turma-id="turma.id"
              @end="(evt) => onDrop(turma, evt)"
            >
              <template #item="{ element }">
                <v-col cols="12" sm="6">
                  <v-card outlined class="pa-3 ma-1">
                    <div style="font-size: 0.9rem;">
                      <strong>Nome:</strong> {{ element.name }}<br />
                      <strong>Idade:</strong> {{ element.age }}<br />
                      <strong>Sexo:</strong> {{ element.gender }}<br />
                      <strong>Experiência:</strong> {{ element.experience_level }}
                    </div>
                  </v-card>
                </v-col>
              </template>
            </draggable>

            <!-- Exibir alerta apenas se não houver alunos -->
            <v-alert
              v-if="turma.students?.length === 0"
              type="info"
              density="compact"
              border="start"
              class="mt-2"
            >
              Nenhum aluno cadastrado nesta turma.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
   </v-container>

</template>
<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import {loadClasses} from '@/services/user.js'
  import draggable from "vuedraggable";


  const filtroNivel = ref('todos')
  const dataScheduleStore = ref([])

  const props = defineProps({
    dataSchedules:{
      Object
    }
  })

  // este metodo retorna os dados dos alunos
  watch(() => props.dataSchedules, (newValue) => {
    dataScheduleStore.value = newValue
  }, { immediate: true })



  const allClassSchedules = ref([])
  onMounted(async () => {

    // este metodo retorna as turmas que não tem alunos
    const response = await loadClasses()
    if (response) {
      // allClassSchedules.value = response.data
      allClassSchedules.value = response.data.filter(turma => turma.students.length === 0);
    }


  })

  const onDrop = (turmaOrigem, evt) => {

    const alunoMovido = evt.item?._underlying_vm_ || evt.clone;
    const turmaDestino = evt.to.dataset?.turmaId || 'Turma não detectada';

    console.log('🔁 Aluno movido:', alunoMovido?.id || alunoMovido);
    console.log('➡️  Turma destino:', turmaDestino);
    console.log('⬅️  Turma origem:', turmaOrigem.id || turmaOrigem);
  }


  const turmasFiltradas = computed(() => {


    if (!Array.isArray(dataScheduleStore.value)) return []

    const agrupadas = {}

    for (const aluno of dataScheduleStore.value) {
      // console.log('Alunos ',aluno);

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

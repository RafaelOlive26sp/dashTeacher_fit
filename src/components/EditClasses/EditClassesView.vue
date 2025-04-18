<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="turma in turmasFiltradas" :key="turma.id" cols="12" md="6">
        <v-card class="mb-4 pa-3" elevation="5" rounded="xl">
          <v-card-title class="py-2 px-4 d-flex justify-space-between align-center"
            :class="corPorNivel(turma.classe.level)" style="font-size: 1rem;">
            <span>{{ turma.classe.name }} ({{ turma.classe.level }})</span>
          </v-card-title>
          <pre>

            <!-- {{ turma.students }} -->
          </pre>
          <v-card-text class="pt-2">
            <!-- Horários -->
            <strong>Horários:</strong>
            <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
              <li v-for="(pattern, index) in turma.classe.schedules_patterns" :key="index">
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>

            <strong>Alunos:</strong>


            <!--                {{// turma.classe}}-->
            <draggable :list="turma.students" group="alunos" item-key="id" class="d-flex flex-wrap" :animation="200"
              @end="(evt) => onDrop(evt)" :data-turma-id="turma.id">
              <!-- <template #item="{ element }">
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
              </template> -->

              <template #item="{ element }">
                <v-col cols="12" sm="6">
                  <v-card outlined class="pa-3 ma-1">
                    <div style="font-size: 0.9rem;">
                      <strong>Nome:</strong> {{ element.user.name }}<br />
                      <strong>Idade:</strong> {{ element.age }}<br />
                      <strong>Sexo:</strong> {{ element.gender }}<br />
                      <strong>Experiência:</strong> {{ element.experience_level }}<br />
                      <strong>Início da matrícula:</strong> {{ element.start_date }}
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
      <v-col v-for="turma in allClassSchedules" :key="`sem-aluno-${turma.id}`" cols="12" md="6">
        <v-card class="mb-4 pa-3" elevation="2" rounded="xl">
          <v-card-title class="py-2 px-4 d-flex justify-space-between align-center" :class="corPorNivel(turma.level)"
            style="font-size: 1rem;">
            <span>{{ turma.name }} ({{ turma.level }})</span>
          </v-card-title>

          <v-card-text class="pt-2">
            <strong>Horários:</strong>
            <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
              <li v-for="(pattern, index) in turma.schedules_patterns" :key="index">
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>

            <!-- Draggable com drop funcional -->
            <draggable :list="turma.students" group="students" item-key="id" class="d-flex flex-wrap" :animation="200"
              @end="(evt) => onDrop(evt)" :data-turma-id="turma.id">
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
            <v-alert v-if="turma.students?.length === 0" type="info" density="compact" border="start" class="mt-2">
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
import { loadClasses } from '@/services/user.js'
import draggable from "vuedraggable";
import { updateStudentsInClass as updateStudentsInClassServicesApi } from '@/services/user.js'


const filtroNivel = ref('todos')
const dataScheduleStore = ref([])

const props = defineProps({
  dataSchedules: {
    Object
  }
})

// este metodo retorna os dados dos alunos
watch(() => props.dataSchedules, (newValue) => {
  dataScheduleStore.value = newValue
  console.log('dataScheduleStore', dataScheduleStore.value);
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

const onDrop = (evt) => {

  const alunoMovido = evt.item?._underlying_vm_ || evt.clone;
  const turmaOrigemId = evt.from.dataset?.turmaId || 'Origem nao detectada';
  const turmaDestinoid = evt.to.dataset?.turmaId || 'Turma não detectada';


  // console.log('🔁 Aluno movido: id ', alunoMovido || alunoMovido);
  // console.log('➡️  Turma destino: id ', turmaDestinoid);
  // console.log('⬅️  Turma origem: id ' , turmaOrigemId.id || turmaOrigemId);

  if (!alunoMovido || !turmaOrigemId || !turmaDestinoid || turmaOrigemId === turmaDestinoid) return;

  const todasAsTurmas = [...turmasFiltradas.value, ...allClassSchedules.value];
  // console.log('todasAsTurmas', todasAsTurmas);

  const turmaOrigem = todasAsTurmas.find(turmaO => turmaO.id == turmaOrigemId);
  const turmaDestino = todasAsTurmas.find(turmaD => turmaD.id == turmaDestinoid);

  if (!turmaOrigem || !turmaDestino) {
    // console.error('Turma de origem ou destino não encontrada');
    return;
  }



  // console.log('turmaOrigem', turmaOrigem);
  // console.log('turmaDestino', turmaDestino);
  // console.log('alunoMovido - Start_date', alunoMovido);





  updateStudentsInClass(turmaDestino, alunoMovido);


  // console.log(`O aluno movido foi ${alunoMovido?.name}, e está na turma ${turmaDestino.id} agora, mas saiu da turma ${turmaOrigem.id} `);

}

const updateStudentsInClass = async (turmaId, alunoId) => {
  console.log('turmaId', alunoId);
  const data = {
    id: alunoId.matriculaId,
    classes_id: turmaId.id,
    students_id: alunoId.studentId,
    start_date: alunoId.start_date,
  }
  console.log('Dados para atualizar os alunos na turma:', data);

  try {
    const response = await updateStudentsInClassServicesApi(data)
    console.log('Resposta do servidor:', response)
  } catch (error) {
    console.error('Erro ao atualizar os alunos na turma:', error)
  }
}

const turmasFiltradas = computed(() => {


  if (!Array.isArray(dataScheduleStore.value)) return []

  const agrupadas = {}

  for (const aluno of dataScheduleStore.value) {
    // console.log('Alunos ',aluno);

    for (const matricula of aluno.classes) {
      // console.log('aluno.Classes-- com ID', aluno.classes);
      // console.log('matricula', matricula);

      const turma = matricula.classe
      // console.log('turma --- ', turma);
      // Verifica se a turma já existe no objeto agrupadas
      const turmaId = turma.id

      if (!agrupadas[turmaId]) {
        agrupadas[turmaId] = {
          id: turmaId,
          classe: turma,
          students: []
        }
      }
      // console.log('agrupadas[turmaId]', agrupadas[turmaId]);

      // Verifica se o aluno já está na turma antes de adicioná-lo
      agrupadas[turmaId].students.push({
        ...aluno,
        studentId:aluno.id,
        matriculaId: matricula.id,
        start_date: matricula.start_date
      })
    }
  }

  const turmas = Object.values(agrupadas)
  // console.log('turmas ---- ', turmas);
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

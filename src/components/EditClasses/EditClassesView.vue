<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="turma in turmasAgrupadas" :key="turma.id" cols="12" md="6">
        <v-card class="mb-4 pa-3" elevation="5" rounded="xl">
          <v-card-title class="py-2 px-4 d-flex justify-space-between align-center"
            :class="corPorNivel(turma.classe.level)" style="font-size: 1rem;">
            <span>{{ turma.classe.name }} ({{ turma.classe.level }})</span>
          </v-card-title>

          <v-card-text class="pt-2">
            <!-- Horários -->
            <strong>Horários:</strong>
            <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
              <li v-for="(pattern, index) in turma.classe.schedules_patterns" :key="index">
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>
            <strong>Alunos:</strong>
            <draggable :list="turma.students" group="alunos" item-key="id" class="d-flex flex-wrap" :animation="200"
              @start="onStartItem" @end="(evt) => onDrop(evt)" :data-turma-id="turma.id">
              <template #item="{ element }">
                <v-col cols="12" sm="6">
                  <v-card outlined class="pa-3 ma-1" :class="{ 'dragging-glow': draggingItemId === element.id }">
                    <!-- {{element}} -->
                    <div style="font-size: 0.9rem;">
                      <strong>Nome:</strong> {{ element.user?.name }}<br />
                      <strong>Idade:</strong> {{ element.age }}<br />
                      <strong>Sexo:</strong> {{ element.gender }}<br />
                      <strong>Experiência:</strong> {{ element.medical_condition }}
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
    <v-row class="mt-6">
      <v-col v-for="turma in allClassSchedules" :key="`sem-aluno-${turma.id}`" cols="12" md="6">
        <v-card class="mb-4 pa-3" elevation="2" rounded="xl">
          <v-card-title class="py-2 px-4 d-flex justify-space-between align-center" :class="corPorNivel(turma.level)"
            style="font-size: 1rem;">
            <span>{{ turma?.name }} ({{ turma?.level }})</span>
          </v-card-title>
          <v-card-text class="pt-2">
            <strong>Horários:</strong>
            <ul class="ml-4 mb-2" style="font-size: 0.9rem;">
              <li v-for="(pattern, index) in turma.schedules_patterns" :key="index">
                {{ pattern.day_of_week }}: {{ pattern.start_time }} - {{ pattern.end_time }}
              </li>
            </ul>

            <!-- Draggable com drop funcional -->
            <draggable :list="turma.students" group="alunos" item-key="id" class="d-flex flex-wrap" :animation="200"
              @end="(evt) => onDrop(evt)" :data-turma-id="turma.id">
              <template #item="{ element }">
                <v-col cols="12" sm="6">
                  <v-slide-y-transition>
                    <v-card v-if="element.isPlaceholder" class="ma-1 pa-4 d-flex align-center justify-center"
                      style="border: 2px dashed #ccc; min-height: 120px; border-radius: 8px; width: 100%;">
                      Solte um aluno aqui
                    </v-card>
                    <v-card v-else outlined class="pa-3 ma-1">
                      <div style="font-size: 0.9rem;">
                        <strong>Nome:</strong> {{ element.user.name }}<br />
                        <strong>Idade:</strong> {{ element.age }}<br />
                        <strong>Sexo:</strong> {{ element.gender }}<br />
                        <strong>Experiência:</strong> {{ element.experience_level }}<br />
                        <strong>Início da matrícula:</strong> {{ element.start_date }}
                      </div>
                    </v-card>
                  </v-slide-y-transition>
                </v-col>
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <TutorialView title="Como funciona?" :show="true" :close="false">
    <template v-slot:contentTutorial>
      <p>Arraste os alunos entre as turmas para realocá-los.</p>
      <p>As turmas sem alunos são exibidas no final.</p>
      <p>Apos isto esta tudo certo o Aluno ja foi transferido de turma</p>
    </template>
  </TutorialView>
</template>
<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { loadClasses } from '@/services/user.js'
import draggable from "vuedraggable";
import { updateStudentsInClass as updateStudentsInClassServicesApi } from '@/services/user.js'
import { useUserStore } from '@/stores/user.js'
import TutorialView from '@/components/tutorial/TutorialView.vue'


const emit = defineEmits(['updateClass'])
const userStore = useUserStore()
const filtroNivel = ref('todos')
const dataScheduleStore = ref([])
const draggingItemId = ref(null)
const turmasAgrupadas = ref([])




// este metodo retorna os dados dos alunos
watch(() => userStore.dataScheduleStoreUsersClass, (newValue) => {
  if (!newValue || !newValue.data) return
  dataScheduleStore.value = newValue.data
}, { immediate: true })



const allClassSchedules = ref([])
onMounted(async () => {

  // este metodo retorna as turmas que não tem alunos
  const response = await loadClasses()
  if (response) {
    const turmasSemAlunos = response.data.filter(turma => turma.students.length === 0)
      .map(turma => ({
        ...turma,
        students: [{ isPlaceholder: true }] // Adiciona um aluno fictício para exibir o card
      }))
    allClassSchedules.value = turmasSemAlunos

  }


})


const onStartItem = (evt) => {
  const item = evt.item?.__draggable_context?.element
  draggingItemId.value = item?.id

}

const onDrop = (evt) => {
  draggingItemId.value = null
  const alunoMovido = evt.item?._underlying_vm_ || evt.clone;
  const turmaOrigemId = evt.from.dataset?.turmaId || 'Origem nao detectada';
  const turmaDestinoid = evt.to.dataset?.turmaId || 'Turma não detectada';

  if (!alunoMovido || !turmaOrigemId || !turmaDestinoid || turmaOrigemId === turmaDestinoid) return;

  const todasAsTurmas = [...turmasFiltradas.value, ...allClassSchedules.value];
  const turmaOrigem = todasAsTurmas.find(turmaO => turmaO.id == turmaOrigemId);
  const turmaDestino = todasAsTurmas.find(turmaD => turmaD.id == turmaDestinoid);

  if (!turmaOrigem || !turmaDestino) {

    return;
  }

  updateStudentsInClass(turmaDestino, alunoMovido);

  // Update turmaOrigem and turmaDestino
  if (!turmaOrigem.students.length) {

    const turmaOrigemCompleta = {
      id: turmaOrigem.id,
      classe: turmaOrigem.classe,
      students: [{ isPlaceholder: true }]
    };

    allClassSchedules.value.push({
      ...turmaOrigemCompleta.classe,
      students: [{ isPlaceholder: true }]
    });

  }
  if (turmaDestino.students.length) {
    turmaDestino.students = turmaDestino.students.filter(s => !s.isPlaceholder);
    allClassSchedules.value = allClassSchedules.value.filter(t => t.id !== turmaDestino.id);
  }

}

const updateStudentsInClass = async (turmaId, alunoId) => {

  const data = {
    id: alunoId.matriculaId,
    classes_id: turmaId.id,
    students_id: alunoId.studentId,
    start_date: alunoId.start_date,
  }
  try {
    await updateStudentsInClassServicesApi(data)

    await userStore.getDataScheduleStore()
    emit('updateClass') // Emite o evento para o pai, se necessário

  } catch (error) {
    console.error('Erro ao atualizar os alunos na turma:', error)
  }
}

const turmasFiltradas = computed(() => {

  if (filtroNivel.value === 'todos') return turmasAgrupadas.value
  return turmasAgrupadas.value.filter(t => t.classe.level === filtroNivel.value)

})


watchEffect(() => {
  if (!Array.isArray(dataScheduleStore.value)) return

  const agrupadas = {}

  for (const aluno of dataScheduleStore.value) {
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
        ...aluno,
        studentId: aluno.id,
        matriculaId: matricula.id,
        start_date: matricula.start_date,

      })
    }
  }


  turmasAgrupadas.value = Object.values(agrupadas)
})



const corPorNivel = (level) => {
  if(level === 'beginner'){
    return 'bg-blue-darken-1 text-white'
  }
  if(level === 'intermediate'){
    return 'bg-green-darken-1 text-white'
  }
  if(level === 'advanced'){
    return 'bg-red-darken-1 text-white'
  }
}
</script>

<style scoped>
.dragging-glow {
  border: 2px solid #4f98f7;
  box-shadow: 0 0 12px 4px #4f7cf7;
  transition: box-shadow 0.3s ease, border 0.3s ease;
}

@keyframes glowPulse {
  from {
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
    transform: scale(1);
  }

  to {
    box-shadow: 0 0 20px rgba(0, 123, 255, 1);
    transform: scale(1.02);
  }
}
</style>

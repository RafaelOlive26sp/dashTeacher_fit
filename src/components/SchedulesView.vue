<template>
  <v-form @submit.prevent="submitForm" ref="form">
    <v-select v-model="newClass.day_of_week" :items="weekDays" label="Dia da Semana" item-title="label"
      item-value="value" required></v-select>

    <v-text-field v-model="newClass.start_time" label="Horário de Início" type="time" required></v-text-field>
    <div class="text-center">
      <v-btn type="submit" :loading="loading" >
        Criar Aula

        <template v-slot:loader>
          <v-progress-linear indeterminate></v-progress-linear>
        </template>
      </v-btn>
    </div>
  </v-form>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>
</template>


<script setup>
import { ref, defineProps, watch, onMounted } from 'vue';
// import { useUserStore } from "@/stores/user.js";
import { createdScheduleInClass as createdScheduleInClassApi } from "@/services/user.js";


// const userStore = useUserStore();°
const snackbarMessage = ref('');
const snackbar = ref(false)
const props = defineProps({
  classId: Number
});
const emit = defineEmits(['close', 'refresh-data']);
const loading = ref(false)

const newClass = ref({
  day_of_week: '',
  start_time: '',
  classes_id: '',
});




onMounted(() => {
  newClass.value.classes_id = props.classId
})

const weekDays = [
  { value: 'sunday', label: 'Domingo' },
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
  { value: 'saturday', label: 'Sábado' },
];

// Atualiza classes_id sempre que turma for alterada
watch(
  () => props.selectedClass,
  (turma) => {
    if (turma) {
      newClass.value.classes_id = turma.id;

    }
  },
  { immediate: true }
);
// watch(loading, val =>{
//   if(val) return
//     setTimeout(() => {
//       loading.value = false
//     }, 2000);
// })

const submitForm = async () => {
  try {
    // console.log('NewClass enviando para services ',newClass.value);
    const response = await createdScheduleInClassApi(newClass.value);
    // console.log('resposta da api dentro da view ', response);
    snackbarMessage.value = response.message
    snackbar.value = true
    loading.value = true
    emit('refresh-data');
    setTimeout(() => {
      emit('close');
    }, 2000)
  } catch (e) {
    console.log(e)
  }
};

// Validação e envio serão feitos no componente pai pelo @confirm
defineExpose({ newClass });
</script>

<template>
  <v-container>
<!--    {{props.data[0].user}}-->
<!--    <br>-->
<!--    {{props.data[0].turma}}-->
    <v-row justify="center">
      <!-- Card da Turma -->
      <v-col cols="12" md="8">
        <v-sheet elevation="3" class="pa-4">
          <v-card color="primary" dark class="ma-2 pa-3">
            <v-card-title class="text-h6">Turma Selecionada: {{ turma?.name }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div><strong>Nível:</strong> {{ levelLabel(turma?.level) }}</div>
                  <div><strong>Máx. alunos:</strong> {{ turma?.max_students }}</div>
                  <div><strong>Criada em:</strong> {{ formatDate(turma?.created_at) }}</div>
                </v-col>
                <v-col cols="6">
                  <div><strong>Horários:</strong></div>
                  <ul class="pl-4">
                    <li v-for="(schedule, index) in turma?.schedules_patterns" :key="index">
                      {{ translateDay(schedule.day_of_week) }} -
                      {{ schedule.start_time.slice(0, 5) }} às
                      {{ schedule.end_time.slice(0, 5) }}
                    </li>
                    <p v-if="turma?.schedules_patterns.length === 0">Sem Horários.</p>
                  </ul>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>

      <!-- Card do Aluno -->
      <v-col cols="12" md="8">
        <v-sheet elevation="3" class="pa-4">
          <v-card color="success" dark class="ma-2 pa-3">
            <v-card-title class="text-h6">Aluno Selecionado: {{ aluno?.user.name }}</v-card-title>
            <v-card-text>
              <div><strong>Idade:</strong> {{ aluno?.age }} anos</div>
              <div><strong>Altura:</strong> {{ aluno?.height }} m</div>
              <div><strong>Peso:</strong> {{ aluno?.weight }} kg</div>
              <div><strong>Gênero:</strong> {{ aluno?.gender }}</div>
              <div><strong>Condição médica:</strong> {{ aluno?.medical_condition }}</div>
              <div><strong>Último Pagamento:</strong></div>
              <ul>
                <li v-for="(pagamento, index) in aluno?.payments" :key="index">
                  {{ pagamento.status }} - R$ {{ pagamento.amount }} - Vencimento: {{ formatDate(pagamento.due_date) }}
                </li>
                <p v-if="aluno?.payments.length === 0">Nenhum pagamento registrado.</p>
              </ul>
            </v-card-text>
          </v-card>
        </v-sheet>
      </v-col>

      <!-- Campo de Data de Início -->
      <v-col cols="12" md="8">
        <v-text-field
          v-model="startDate"
          type="date"
          label="Data de Início do Aluno na Turma"
          :rules="[v => !!v || 'A data de início é obrigatória']"
          outlined
          dense
          clearable
        ></v-text-field>
      </v-col>

      <!-- Botão de Confirmação -->
      <v-col cols="12" md="8" class="text-right">
        <v-btn color="primary" @click="confirmarAgendamento" :loading="loading">
          Confirmar Agendamento
          <template v-slot:loader>
            <v-progress-linear indeterminate></v-progress-linear>
          </template>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
    <v-alert :text="messageAlert" :type="color" variant="tonal" border="start"
             :border-color="border_color_alert"
             elevation="2" v-if="exibirAlerta"></v-alert>
</template>

<script setup>
import { ref,watch } from 'vue'
import {handleAppointmentUser as handleAppointmentUserApi} from '@/services/user.js'
import { useUserStore } from '@/stores/user.js'


const userStore = useUserStore()
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Variáveis
  const aluno = props.data[0].user;
  const turma = props.data[0].turma;
  const startDate = ref(null); // nova data de início
  const messageAlert = ref('');
  const exibirAlerta = ref(false);
  const loading = ref(false);
  const color = ref('warning');
  const border_color_alert = ref('error accent-2');


  const emit = defineEmits(['confirmar']);

// Funções auxiliares
  const levelLabel = (level) => {
    const levels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return levels[level] || 'Desconhecido';
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
    return days[day] || day;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  watch(
    ()=> userStore.successAppointmentUserData,
    async (newValue) => {
        if (newValue){
          exibirAlerta.value = true
          color.value = 'success'
          border_color_alert.value = 'success ascent-4'
          messageAlert.value = newValue.message
          setTimeout(() => {
            exibirAlerta.value = false
            loading.value = false
            emit('confirmar', newValue)
          }, 2000);
        }
      // console.log('newValue', newValue.message);
        }
  )
  const confirmarAgendamento = async () => {

    if (!startDate.value) {
        messageAlert.value = 'Por favor, selecione uma data de início antes de confirmar.'
        exibirAlerta.value = true
      return;
    }


    const dados = {
      students_id: aluno.id,
      classes_id: turma.id,
      start_date: startDate.value
    };
    // console.log('dados', dados);
    // emit('confirmar', dados);
    loading.value = true
    try{
      const response = await handleAppointmentUserApi(dados);
      await userStore.successAppointmentUser(response)
    }catch (e) {
      console.log(e)
    }


  };
</script>

<style scoped>
ul {
  list-style-type: disc;
  padding-left: 1rem;
}
</style>

<template>
  <v-container>
    <v-row>

      <!-- Card que exibe os dados do aluno -->
      <v-col v-for="aluno in toggleCardPayment" :key="aluno.id" cols="12" sm="6" md="4">
        <v-card class="pa-3">
          <v-card-title>{{ aluno.user.name }}</v-card-title>
          <divider></divider>
          <v-card-text v-if="toggleMethodsPayment === 'confirmPayment'">
            <p><strong>Valor R$: </strong>{{ aluno.payments[0].amount }} </p>
            <p><strong>Próximo pagamento: </strong>{{ formatDate(aluno.payments[0].due_date) }} </p>
            <p><strong>Status: </strong>{{ aluno.payments[0].status }} </p>
          </v-card-text>
          <v-card-actions v-if="toggleMethodsPayment !== 'confirmPayment'">
            <v-btn color="primary" @click="opensheet('agendar',aluno)">
              Agendar Pagamento
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-btn color="primary" @click="opensheet(toggleMethodsPayment, aluno)" :loading="loadingPayment">
              Confirmar Pagamento
              <template v-slot:loader>
                <v-progress-linear indeterminate></v-progress-linear>
              </template>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-bottom-sheet v-model="sheet" inset>
        <v-card class="pa-5 text-center">
          <v-card-title class="text-h6" v-if="toggleMethodsPayment !== 'confirmPayment'">Agendar
            Pagamento</v-card-title>
          <v-card-title class="text-h6" v-else>Pagamento Confirmado com Sucesso</v-card-title>
          <v-divider class="mb-4"></v-divider>
          <!-- Exibir formulário quando o pagamento ainda não foi confirmado -->
          <template v-if="!paymentSuccess && toggleMethodsPayment !== 'confirmPayment'">
            <v-card-text>
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field v-model="valor" :disabled="scheduleProgress" label="Valor do Pagamento" prefix="R$"
                    type="number" :rules="[rules.required, rules.valor, rules.noCaracters, rules.min]"  />
                </v-col>
              </v-row>
              <v-row justify="center" v-if="alunoSelecionado">
                <v-col cols="6">
                  <v-text-field :model-value="alunoSelecionado.user.name" disabled label="Aluno" readonly
                    variant="outlined" />
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field :model-value="dataAtual" label="Data" disabled readonly variant="outlined" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="primary" :loading="loadingPayment"
                @click="toggleMethodsPayment === 'confirmPayment' ? paymentConfirmed() : schedulePayment()">
                Confirmar Pagamento
                <template v-slot:loader>
                  <v-progress-linear indeterminate></v-progress-linear>
                </template>
              </v-btn>
            </v-card-actions>
            <div v-if="errorMessage" class="text-red">{{ errorMessage }}</div>
          </template>
          <!-- Tela de sucesso -->
          <template v-else>
            <v-card-text>
              <v-icon color="success" size="80">mdi-check-circle</v-icon>
              <p class="text-h6 mt-3" v-if="toggleMethodsPayment !== 'confirmPayment'">Agendamento realizado com
                sucesso!</p>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn color="primary" @click="sheet = false">Fechar</v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-bottom-sheet>
    </div>
  </v-container>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>
</template>

<script setup>
import { onMounted, ref, shallowRef, computed, watch, toRef, defineProps } from "vue";
import {
  getStudentsWithUser as getStudentsWithUserApi,
  fetchPaymentUser as fetchPaymentUserApi,
  getPayments as getPaymentsApi,
  confirmPayment as confirmPaymentApi

} from "@/services/user"
import { useUserStore } from "@/stores/user.js";
import SnackBarsView from "@/components/snackBar/SnackBarsView.vue";
import { format } from 'date-fns';
import { handleError } from "@/utils/ErrorHandle";


const userStore = useUserStore();
const props = defineProps(["confirmPayment"]);
const confirmPayment = toRef(props, "confirmPayment");
const emit = defineEmits('reloadPayments')

const data = ref([]);
const sheet = shallowRef(false)
const valor = ref("");
const alunoSelecionado = ref(null);
const loadingPayment = ref(false);
const errorMessage = ref("");
const snackbarMessage = ref("");
const snackbar = ref(false)
const scheduleProgress = ref(false)
const paymentSuccess = ref("");
const toggleMethodsPayment = ref("");
const status = ref("paid");
const rules = {
  required: v => !!v || "Campo obrigatório",
  valor: v =>  v >= 10 || "Valor deve ser maior que 10",
  min: v=> v.length >=2 || 'Deve ter pelo menos 2 caracteres',
  noCaracters: v => /^[0-9]*$/.test(v) || "Não pode conter caracteres especiais ou letras",
}
const loadingInitialData = ref(true);



const dataAtual = computed(() => {
  return new Date().toLocaleDateString("pt-BR");
});

// esta funcao lê cada objto do array que esta na paginação
const fetchAllStudents = async () => {
  let page = 1
  const itemsPerPage = 5
  const allStudent = []
  try {
    let response

    do {
      response = await getStudentsWithUserApi(page, itemsPerPage);
      if (response.data.length > 0) {
        allStudent.push(...response.data);
      }
      page++;
    } while (page <= response.meta.last_page);
        data.value = allStudent;
          
  } catch (error) {
    handleError('Erro ao buscar os estudantes', error);
  }finally {
    loadingInitialData.value = false;
  }

}

onMounted(async () => {
  await fetchAllStudents();
  // getStudents();
});
watch(confirmPayment, (newValue) => {
  // console.log("Novo valor de confirmPayment:", newValue);
  toggleMethodsPayment.value = newValue;
}, { immediate: true });

const getStudents = async () => {
  try {
    const response = await getStudentsWithUserApi();
    userStore.getStudentsWithUser(response);
    data.value = response.data;
  } catch (error) {
    handleError("Error fetching students:", error);
  }
};

const updatePayments = async () => {
  try {
    const response = await getPaymentsApi();
    userStore.getPayment(response);
  } catch (error) {
    handleError('Erro ao atualizar pagamentos:', error);
  }
};

const schedulePayment = async () => {
  if (!valor.value || !alunoSelecionado.value) {
    alert("Por favor, insira um valor e selecione um aluno!");
    return;
  }
  loadingPayment.value = true;
  errorMessage.value = "";


  try {
    const paymentData = {
      userId: alunoSelecionado.value.user.id,
      amount: valor.value,
    };
    const response = await fetchPaymentUserApi(paymentData)

    if (response) {
      setTimeout(() => {
        loadingPayment.value = false;
        paymentSuccess.value = true; // Exibir a tela de sucesso
      }, 2000);
    }
        userStore.fetchPayments(response);
        scheduleProgress.value = true;
    // getStudents()
    updatePayments()
    fetchAllStudents()
    // console.log('estamos enviando o emit de schedulePayment')
    emit('reloadPayments')

  } catch (error) {
    handleError('Erro ao agendar pagamento', error);
    snackbar.value = false
    scheduleProgress.value = false;
    setTimeout(() => {
      snackbarMessage.value = error.message;
      snackbar.value = true
    }, 100)
    loadingPayment.value = false

  }
};

const paymentConfirmed = async (aluno) => {


  try {
    const data = {
      id: aluno.id,
      amount: aluno.payments[0].amount,
      status: status.value,
      due_date: aluno.payments[0].due_date,
    }


    const response = await confirmPaymentApi(data);
     await userStore.confirmPaymentStore(response);
    updatePayments()
    fetchAllStudents()
    
    emit('reloadPayments')

  } catch (error) {
    handleError(error, 'Erro ao confirmar pagamento');

  }
}



const opensheet = (metodo, aluno) => {
  if (metodo === 'confirmPayment') {
    paymentConfirmed(aluno)
    sheet.value = true;
    return;

  }
  alunoSelecionado.value = aluno;


  sheet.value = true;
};

const toggleCardPayment = computed(() => {
  if (loadingInitialData.value) {
    return [];
  }
  if (toggleMethodsPayment.value === 'schedulePayment') {
    return studentsNotPayment(); 
  }
  return studentsWithPendingPayments(); // Retorna todos os alunos com pagamentos pendentes

});

const studentsNotPayment = ()=>{
  return [...data.value].filter(student => !student.payments || student.payments.length === 0);
}

const studentsWithPendingPayments = () => {
   return [...data.value].filter(student => 
    student.payments?.length > 0 && 
    student.payments.some(p => p.status === 'pending')
  );
  
};

const formatDate = (date) => {
  return format(new Date(date), "dd/MM/yyyy");
};
</script>


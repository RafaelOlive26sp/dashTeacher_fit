<template>
  <v-container>
    <v-row >

      <v-col v-for="aluno in data.filter(a => a.payment.length === 0)" :key="aluno.id" cols="12" sm="6" md="4" >
        <v-card class="pa-3" >
          <v-card-title>{{ aluno.user.name }}</v-card-title>
          <v-card-subtitle>Idade: {{ aluno.age }} anos</v-card-subtitle>
          <divider></divider>
          <v-card-text>

<!--            <p><strong>Plano:</strong> Em Breve! </p>-->
<!--            <p><strong>Próximo pagamento:</strong> falta ajuste </p>-->


          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" @click="opensheet(aluno)">
              Agendar Pagamento
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>

    </v-row>
    <div class="text-center">
      <v-bottom-sheet v-model="sheet" inset>
        <v-card class="pa-5 text-center">
          <v-card-title class="text-h6">Agendar Pagamento</v-card-title>
          <v-divider class="mb-4"></v-divider>

          <!-- Exibir formulário quando o pagamento ainda não foi confirmado -->
          <template v-if="!paymentSuccess">
            <v-card-text>
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field
                    v-model="valor"
                    :disabled="scheduleProgress"
                    label="Valor do Pagamento"
                    prefix="R$"
                    type="number"
                    required
                  />
                </v-col>
              </v-row>

              <v-row justify="center" v-if="alunoSelecionado">
                <v-col cols="6">
                  <v-text-field
                    :model-value="alunoSelecionado.user.name"
                    disabled label="Aluno"
                    readonly variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field
                    :model-value="dataAtual"
                    label="Data"
                    disabled
                    readonly variant="outlined"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn
                color="primary"
                :loading="loadingPayment"
                @click="schedulePayment"
              >
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
              <p class="text-h6 mt-3">Pagamento realizado com sucesso!</p>
            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn color="primary" @click="sheet = false">Fechar</v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-bottom-sheet>



    </div>


  </v-container>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar" >
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>

</template>

<script setup>
import { onMounted, ref, shallowRef, computed } from "vue";
import { getStudentsWithUser as getStudentsWithUserApi} from "@/services/user";
import { fetchPaymentUser as fetchPaymentUserApi  } from "@/services/user";
import { getPayments as getPaymentsApi   } from "@/services/user";
import { useUserStore } from "@/stores/user.js";
import SnackBarsView from "@/components/snackBar/SnackBarsView.vue";


const userStore = useUserStore();

onMounted(async () => {
  await getStudents();
});

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


const dataAtual = computed(() => {
  return new Date().toLocaleDateString("pt-BR");
});

const getStudents = async () => {
  try {
    const response = await getStudentsWithUserApi();
    userStore.getStudentsWithUser(response);
    data.value = response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

const updatePayments = async () => {
  try {
    const response = await getPaymentsApi();
    userStore.getPayment(response);
  } catch (error) {
    console.error('Erro ao atualizar pagamentos:', error);
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
    console.log("Resposta da API:", response);
    userStore.fetchPayments(response);
    // sheet.value = false
    scheduleProgress.value = true;
      getStudents()
      updatePayments()

  } catch (error) {
    snackbar.value = false
    scheduleProgress.value = false;
    setTimeout(()=>{
      snackbarMessage.value =  error.message;
      snackbar.value = true
    },100)
    loadingPayment.value = false

  }
};



const opensheet = (aluno) => {
  alunoSelecionado.value = aluno;
  // console.log(aluno);

  sheet.value = true;
}


// const confirmarPagamento = () => {
//   if (!valor.value) {
//     alert("Por favor, insira um valor!");
//     return;
//   }
//   alert(`Pagamento de R$${valor.value} agendado para ${dataAtual.value}`);
//   sheet.value = false;
// };



</script>

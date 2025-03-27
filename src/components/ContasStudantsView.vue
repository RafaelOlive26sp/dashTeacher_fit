<template>
  <v-container>
    <v-row>
      <v-col v-for="aluno in data" :key="aluno.id" cols="12" sm="6" md="4">
        <v-card class="pa-3">
          <v-card-title>{{ aluno.user.name }}</v-card-title>
          <v-card-subtitle>Idade: {{ aluno.age }} anos</v-card-subtitle>
          <divider></divider>
          <v-card-text>

            <p><strong>Plano:</strong> Em Breve! </p>
            <p><strong>Próximo pagamento:</strong> falta ajuste </p>
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

          <v-card-text>
            <v-row justify="center">
              <v-col cols="6">
                <v-text-field v-model="valor" label="Valor do Pagamento" prefix="R$" type="number" required />
              </v-col>
            </v-row>
            <v-row justify="center" v-if="alunoSelecionado">
              <v-col cols="6">
                <v-text-field :model-value="alunoSelecionado.user.name" label="Aluno" readonly variant="outlined" />
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col cols="6">
                <v-text-field :model-value="dataAtual" label="Data" readonly variant="outlined" />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="schedulePayment">
              Confirmar Pagamento
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
    </div>

  </v-container>


</template>

<script setup>
import { onMounted, ref, shallowRef, computed } from "vue";
import { getStudentsWithUser as getStudentsWithUserApi } from "@/services/user";
import { useUserStore } from "@/stores/user.js";


const userStore = useUserStore();

onMounted(async () => {
  await getStudents();
});

const data = ref([]);
const sheet = shallowRef(false)
const valor = ref("");
const alunoSelecionado = ref(null);


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

const schedulePayment = () => {

  if (!valor.value || !alunoSelecionado.value) {
    alert("Por favor, insira um valor e selecione um aluno!");
    return;
  }

  try {

  } catch (error) {
    console.log(error);

  }
};
const opensheet = (aluno) => {
  alunoSelecionado.value = aluno;
  console.log(aluno);

  sheet.value = true;
}


const confirmarPagamento = () => {
  if (!valor.value) {
    alert("Por favor, insira um valor!");
    return;
  }
  alert(`Pagamento de R$${valor.value} agendado para ${dataAtual.value}`);
  sheet.value = false;
};



</script>

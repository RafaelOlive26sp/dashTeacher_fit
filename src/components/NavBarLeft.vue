<template>

  <v-layout app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <!-- <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="email@gmailcom"
          :title="user?.name"></v-list-item> -->
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="user?.name" @click="openDialog(item, 'perfil')"></v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" to="/pagamentos">
              <template #prepend>
                <v-badge color="warning" dot v-if="existPayments">
                  <template #badge>
                    <span></span>
                  </template>
                  <v-icon>mdi-cash-register</v-icon>
                </v-badge>
                <v-icon v-else>mdi-cash-register</v-icon>
              </template>
              <v-list-item-title>Pagamentos</v-list-item-title>
            </v-list-item>
          </template>
          <v-badge color="success" :content="studentsDotPayment" v-if="studentsDotPayment > 0">
            <v-list-item title="Agendar Pagamentos" @click="openDialog(item, 'agendar')"></v-list-item>
          </v-badge>
          <v-badge color="success" :content="paymentPending" v-if="paymentPending > 0">
            <v-list-item title="Confirmar Pagamentos" @click="openDialog(item, 'confirmar')"></v-list-item>
          </v-badge>

        </v-list-group>



        <v-list-item prepend-icon="mdi-account-group" title="Alunos" to="/alunos"></v-list-item>
        <v-list-item prepend-icon="mdi-notebook-outline" title="Agendamentos" to="/agenda"></v-list-item>
        <v-list-group prepend-icon="mdi-book-cog-outline">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Aulas/Turmas"></v-list-item>
          </template>
          <v-list-item title="Criar Turmas" @click="openDialog(item, 'createdClass')" ></v-list-item>
          <v-list-item title="Criar Horarios"  @click="openDialog(item, 'createdSchedule')"></v-list-item>
        </v-list-group>
      </v-list>

    </v-navigation-drawer>

    <v-main class="pa-4">
      <slot name="content"></slot>
    </v-main>

  </v-layout>
  <Dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm"  >
    <ContasStudantsView v-if="actionType === 'agendar'|| actionType === 'confirmar' " :confirmPayment="ifConfirmPayment" @relodingPayments="reloadPayments()"></ContasStudantsView>
    <CreatedClassView v-if="actionType === 'createdClass'" @close="dialogVisible = false"></CreatedClassView>
    <createdScheduleView v-if="actionType === 'createdSchedule'"></createdScheduleView>
    <EditPerfilView v-if="actionType === 'perfil'" @close="dialogVisible = false"></EditPerfilView>
  </Dialogs>


</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref,onMounted } from 'vue';
import CreatedClassView from "@/components/CreatedClassView.vue";
import createdScheduleView from "@/components/CreatedScheduleView.vue";
import ContasStudantsView from "@/components/ContasStudantsView.vue";
import EditPerfilView from "@/components/perfil/EditPerfilView.vue";
import {useUserStore} from "@/stores/user.js";
import {getStudentsWithUser as getStudentsWithUserApi} from "@/services/user.js";
// import { useUserStore } from '@/stores/user.js';


// const userStore = useUserStore();
const userStore = useUserStore();
const AuthStore = useAuthStore();
const user = computed(() => AuthStore.user);

const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogActionText = ref("");
const selectedItem = ref(null);
const actionType = ref("");
const ifConfirmPayment = ref('');
const existPayments = ref(false)
const studentsDotPayment = ref(null)
const paymentPending = ref(null)


onMounted(() => {
  fetchAllStudents()

})

const fetchAllStudents = async()=>{
  let page= 1
  const itemsPerPage = 5
  const allStudent = []
  try {
    let response

    do {
      response = await getStudentsWithUserApi(page, itemsPerPage);
      if( response.data.length > 0){
        allStudent.push(...response.data);
      }
      page++;
    } while (page <= response.meta.last_page);
    await userStore.getStudentsWithUser(allStudent);


    const paymentsPending = allStudent.filter(item => item.payments[0]?.status === 'pending') // retorna o aluno que esta com o pagamento pendente
    const studentsNotPayments = allStudent.filter(s => s.payments?.length === 0)

    if(paymentsPending.length !== 0 || studentsNotPayments.length !== 0){
      paymentPending.value = paymentsPending.length
      studentsDotPayment.value = studentsNotPayments.length
      existPayments.value = true
    }

  } catch (error) {
    console.log('Erro ao buscar os estudantes',error);

  }
}



const openDialog = (item, type) => {
  selectedItem.value = item;
  actionType.value = type;
  dialogVisible.value = true;
  ifConfirmPayment.value = 'false'

  if (type === "agendar") {
    dialogTitle.value = "Agendar Pagamentos";


  }else if(type === "confirmar"){
    dialogTitle.value = "Confirmar Pagamento";
    // console.log('antes da mudanca ',ifConfirmPayment.value);
    ifConfirmPayment.value = 'confirmPayment';
    // console.log('depois da mudanca ',ifConfirmPayment.value);

    // console.log('dialog ', dialogVisible.value)

    dialogActionText.value = "sair";
  }
  if (type === 'createdClass'){
    dialogTitle.value = "Criar Turmas";


  }else if (type === 'createdSchedule'){
    dialogTitle.value = "Criar Horarios";
    // dialogActionText.value = "Criar Horarios";

  }
  if (type === 'perfil'){
    dialogTitle.value = "Perfil";

  }
};

const reloadPayments =()=>{
  console.log('estamos dentro da funcao de reload');

  fetchAllStudents()
}



</script>

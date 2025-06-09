<template>
  <v-layout>
    <!-- App Bar com ícone de menu para mobile -->
    <v-app-bar
      v-if="$vuetify.display.mdAndDown"
      app
      color="dark"
      dark
    >
      <v-app-bar-nav-icon
      class="d-md-none"
      @click="drawer = !drawer"
      />
      <v-toolbar-title>Nome do Usuario</v-toolbar-title>
    </v-app-bar>

    <!-- Drawer responsivo -->
    <v-navigation-drawer
       v-model="drawer"
      :temporary="$vuetify.display.mdAndDown"
      :permanent="$vuetify.display.lgAndUp"
      expand-on-hover
      rail
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="user?.name"
          @click="openDialog(item, 'perfil')"
        />
      </v-list>

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/" />
        <v-list-group>
          <template #activator="{ props }">
            <v-list-item v-bind="props" to="/pagamentos">
              <template #prepend>
                <v-badge color="warning" dot v-if="existPayments">
                  <template #badge>
                    <span />
                  </template>
                  <v-icon>mdi-cash-register</v-icon>
                </v-badge>
                <v-icon v-else>mdi-cash-register</v-icon>
              </template>
              <v-list-item-title>Pagamentos</v-list-item-title>
            </v-list-item>
          </template>
          <v-badge color="success" :content="studentsDotPayment" v-if="studentsDotPayment > 0">
            <v-list-item title="Agendar Pagamentos" @click="openDialog(item, 'agendar')" />
          </v-badge>
          <v-badge color="success" :content="paymentPending" v-if="paymentPending > 0">
            <v-list-item title="Confirmar Pagamentos" @click="openDialog(item, 'confirmar')" />
          </v-badge>
        </v-list-group>
        <v-list-item prepend-icon="mdi-account-group" title="Alunos" to="/alunos" />
        <v-list-item prepend-icon="mdi-notebook-outline" title="Agendamentos" to="/agenda" />
        <v-list-group prepend-icon="mdi-book-cog-outline">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Aulas/Turmas" />
          </template>
          <v-list-item title="Criar Turmas" @click="openDialog(item, 'createdClass')" />
          <v-list-item title="Criar Horarios" @click="openDialog(item, 'createdSchedule')" />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pa-4">
      <slot name="content"></slot>
    </v-main>

    <Dialogs
      v-model="dialogVisible"
      :title="dialogTitle"
      :confirm-button-text="dialogActionText"
      @confirm="handleConfirm"
    >
      <ContasStudantsView
        v-if="actionType === 'agendar'|| actionType === 'confirmar'"
        :confirm-payment="ifConfirmPayment"
        @reload-payments="reloadPayments()"
      />
      <CreatedClassView v-if="actionType === 'createdClass'" @close="dialogVisible = false" />
      <createdScheduleView v-if="actionType === 'createdSchedule'" />
      <EditPerfilView v-if="actionType === 'perfil'" @close="dialogVisible = false" />
    </Dialogs>
  </v-layout>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref,onMounted, watch } from 'vue';
import CreatedClassView from "@/components/CreatedClassView.vue";
import createdScheduleView from "@/components/CreatedScheduleView.vue";
import ContasStudantsView from "@/components/ContasStudantsView.vue";
import EditPerfilView from "@/components/perfil/EditPerfilView.vue";
import {useUserStore} from "@/stores/user.js";
import {getStudentsWithUser as getStudentsWithUserApi} from "@/services/user.js";
import { handleError } from '@/utils/ErrorHandle';
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
const drawer = ref(false);


onMounted(() => {
  fetchAllStudents(),
  drawer.value = !window.innerWidth < 960; // 960px é o breakpoint md do Vuetify

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
    if(paymentsPending.length == 0 && studentsNotPayments.length === 0){
        // console.log('variaveis vazias');
        paymentPending.value = paymentsPending.length
      studentsDotPayment.value = studentsNotPayments.length
        existPayments.value = false

    }
  } catch (error) {
    handleError('Erro ao buscar os estudantes',error);
  }
}
watch(
    ()=>userStore.triggerNavBarRefresh,()=>{
      fetchAllStudents()
      // console.log('chamando o metodo fetchAllStudents')
    },{immediate:true}
)



const openDialog = (item, type) => {
  selectedItem.value = item;
  actionType.value = type;
  dialogVisible.value = true;
  ifConfirmPayment.value = 'schedulePayment';

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
  // console.log('estamos dentro da funcao de reload');
  dialogVisible.value = false
  fetchAllStudents()
}



</script>

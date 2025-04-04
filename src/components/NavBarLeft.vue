<template>

  <v-layout app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <!-- <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" subtitle="email@gmailcom"
          :title="user?.name"></v-list-item> -->
        <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          :title="user?.name"></v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>

        <v-list-group prepend-icon="mdi-cash-register">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Pagamentos" to="/pagamentos"></v-list-item>
          </template>
          <v-list-item title="Agendar Pagamentos"  @click="openDialog(item, 'agendar')"></v-list-item>
          <v-list-item title="Confirmar Pagamentos"  @click="openDialog(item, 'confirmar')"></v-list-item>
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
    <ContasStudantsView v-if="actionType === 'agendar'|| actionType === 'confirmar' " :confirmPayment="ifConfirmPayment"></ContasStudantsView>
    <CreatedClassView v-if="actionType === 'createdClass'" @close="dialogVisible = false"></CreatedClassView>
    <createdScheduleView v-if="actionType === 'createdSchedule'"></createdScheduleView>
  </Dialogs>


</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import CreatedClassView from "@/components/CreatedClassView.vue";
import createdScheduleView from "@/components/CreatedScheduleView.vue";
// import { useUserStore } from '@/stores/user.js';


// const userStore = useUserStore();
const AuthStore = useAuthStore();
const user = computed(() => AuthStore.user);

const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogActionText = ref("");
const selectedItem = ref(null);
const actionType = ref("");
const ifConfirmPayment = ref('');
// const dialogMessage = ref("");


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
    console.log('depois da mudanca ',ifConfirmPayment.value);

    // console.log('dialog ', dialogVisible.value)

    dialogActionText.value = "sair";
  }
  if (type === 'createdClass'){
    dialogTitle.value = "Criar Turmas";


  }else if (type === 'createdSchedule'){
    dialogTitle.value = "Criar Horarios";
    // dialogActionText.value = "Criar Horarios";

  }
};



</script>

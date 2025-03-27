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
          <v-list-item title="Agendar Pagamento"  @click="openDialog(item, 'agendar')"></v-list-item>
          <v-list-item title="Confirmar Pagamento"  @click="openDialog(item, 'confirmar')"></v-list-item>
        </v-list-group>

        <v-list-item prepend-icon="mdi-account-group" title="Alunos" to="/alunos"></v-list-item>
        <v-list-item prepend-icon="mdi-notebook-outline" title="Agendamentos" to="/agenda"></v-list-item>
      </v-list>

      <!-- <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-cash-register" title="Pagamentos" to="/pagamentos" ></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Alunos" to="/alunos"></v-list-item>
        <v-list-item prepend-icon="mdi-notebook-outline " title="Agendamentos" to="/agenda"></v-list-item>
      </v-list> -->
    </v-navigation-drawer>

    <v-main class="pa-4">
      <slot name="content"></slot>
    </v-main>

  </v-layout>
  <Dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm">
    <ContasStudantsView></ContasStudantsView>

  </Dialogs>


</template>
<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const AuthStore = useAuthStore();
const user = computed(() => AuthStore.user);

const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogActionText = ref("");
const selectedItem = ref(null);
const actionType = ref("");
// const dialogMessage = ref("");


const openDialog = (item, type) => {
  selectedItem.value = item;
  actionType.value = type;
  dialogVisible.value = true;

  if (type === "agendar") {
    dialogTitle.value = "Agendar Pagamentos";


  }else if(type === "confirmar"){
    dialogTitle.value = "Confirmar Pagamento";
    // console.log('dialog ', dialogVisible.value)

    dialogActionText.value = "sair";
  }
};



</script>

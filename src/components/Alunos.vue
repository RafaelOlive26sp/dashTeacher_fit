<template>
  <!--
    o evento @update:options="loadItems"
      no componente v-data-table-server para garantir
      que o método loadItems seja chamado sempre que as
      opções da tabela (como a página atual ou o número de itens por página)
      forem atualizadas.
   -->
  <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="itemsUser"
    :items-length="totalItems" :loading="loading" @update:options="loadStudents">
    <template v-slot:item.edit="{ item }">
      <div class="d-flex ga-2 ">
        <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="openDialog(item, 'edit')"></v-icon>
        <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="openDialog(item, 'delete')"></v-icon>
      </div>
    </template>

  </v-data-table-server>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>
  <Dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm">
    <EditAccount v-if="actionType === 'edit'" :dialogVisible="dialogVisible"
      @update:dialogVisible="dialogVisible = $event"></EditAccount>

    <p v-else>{{ dialogMessage }}</p>
  </Dialogs>

</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { getStudentsWithUser as getStudentsServices } from '@/services/user';
import { removeUserApi as removeUserServices } from '@/services/user';
import { nextTick, onMounted, ref, watch } from 'vue';
import Dialogs from './Dialogs.vue';
import EditAccount from './EditAccount.vue'


const userStore = useUserStore();

const headers = [
  { title: 'Nome', value: 'user.name' },
  { title: 'Sexo', value: 'gender' },
  { title: 'Idade', value: 'age' },
  { title: 'Altura', value: 'height' },
  { title: 'Peso', value: 'weight' },
  { title: 'Condição medica', value: 'medical_condition' },
  { title: 'Ações', value: 'edit' },

];


const itemsUser = ref([])
const itemsPerPage = ref(2);
const totalItems = ref(0);
const loading = ref(false);
const options = ref({});
// const showDialog = ref(false);

const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMessage = ref("");
const dialogActionText = ref("");
const selectedItem = ref(null);
const actionType = ref("");
const snackbar = ref(false);
const snackbarMessage = ref("");


onMounted(() => {
  loadStudents(options.value);
});



const loadStudents = async (options) => {
  loading.value = true;
  try {
    const response = await getStudentsServices(options.page, options.itemsPerPage);
    userStore.getStudentsWithUser(response);
    itemsUser.value = response.data;
    itemsPerPage.value = response.meta.per_page;
    totalItems.value = response.meta.total;

  } catch (error) {
    console.log(error);

  } finally {
    loading.value = false
    // setTimeout(() => {
    //   loading.value = true;
    // }, 1000);
  }
};


const openDialog = (item, type) => {
  selectedItem.value = item;
  actionType.value = type;
  dialogVisible.value = true;

  if (type === "edit") {
    dialogTitle.value = "Editar Usuário";
    // console.log(item);

    // dialogMessage.value = `EditAccount`;

    // dialogActionText.value = "Salvar";
  } else {
    dialogTitle.value = "Excluir Usuário";
    dialogMessage.value = `Tem certeza que deseja remover ${item.user.name}?`;
    dialogActionText.value = "Excluir";
  }
};
const handleConfirm = async () => {
  if (actionType.value === "edit") {
    // console.log("Editando usuário:", selectedItem.value);
  } else {
    // console.log("Removendo usuário:", selectedItem.value.user.id);
    try {
      let id = selectedItem.value.user.id;
      const response = await removeUserServices(id);
      await userStore.removeUser(response);
      loadStudents(options.value);

      snackbar.value = false

      await nextTick();

      snackbarMessage.value = `Usuário ${selectedItem.value.user.name} removido com sucesso!`;
      snackbar.value = true;

    } catch (error) {
      console.error(error);
    }

  }


};
watch(() => itemsPerPage.value, () => {
  loadStudents(options.value)
});

</script>

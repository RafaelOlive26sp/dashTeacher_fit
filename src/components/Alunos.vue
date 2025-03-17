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
    <template #item.edit="{ item }">
      <div class="d-flex ga-2 ">
        <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="editUser(item)"></v-icon>
        <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="deleteUser(item)"></v-icon>
      </div>
    </template>

  </v-data-table-server>
  <Dialogs :showDialog="showDialog" @update:showDialog="showDialog = $event"></Dialogs>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { getStudentsWithUser as getStudentsServices } from '@/services/user';
import { onMounted, ref, watch } from 'vue';
import Dialogs from './Dialogs.vue';


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
const showDialog = ref(false)


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

const editUser = (item) => {
  showDialog.value = true
  console.log('estamos no edit', item);

};
const deleteUser = (item) => {
  showDialog.value = true
  console.log('estamos no delete ', item);

};
watch(() => itemsPerPage.value, () => {
  loadStudents(options.value)
});

</script>

<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="serverItems"
    :items-length="totalItems"
    :loading="loading"
    item-value="name"
    @update:options="loadItems"
  ></v-data-table-server>
</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { getStudentsWithUser as getStudentsWithUsers } from '@/services/user';
import { onMounted } from 'vue';
const userStore = useUserStore();

onMounted(() => {
  fethStudents();
});

const fethStudents = async () => {
  try {
    const response = await getStudentsWithUsers();
    userStore.getStudentsWithUser(response);

  } catch (error) {
    console.log(error);

  }
};

</script>


<template>
  <h2>estamos em created Schedule view</h2>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { loadClasses as loadClassesApi } from '@/services/user';
const classSchedules = ref([])

onMounted(async () => {
  await loadDataClasses();
})


const loadDataClasses = async () => {
  try {
    const response = await loadClassesApi()
    classSchedules.value = response.data
  } catch (error) {
    console.log(error);

  }
}





</script>


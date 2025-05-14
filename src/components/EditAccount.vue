<template>
  <v-container>
    <v-row dense>
      <slot name="content"></slot>
    </v-row>
    <small class="text-caption text-medium-emphasis">*Campos Obrigatorios</small>
    <slot name="btnContent"></slot>
  </v-container>


</template>


<script setup>
import { ref } from 'vue';

const editAccount = ref({
  name: "",
  height: "",
  weight: "",
  medical_condition: "",
});

const props = defineProps({
  dialogVisible: Boolean,
});

const emit = defineEmits(['update:dialogVisible']);

// const dialogVisible = ref("");

const closeDialog = () => {
  emit('update:dialogVisible', false);

}

const saveDialog = () => {
  // console.log('Save dialog', editAccount.value);
  let data = {
    name: editAccount.value.name,
    height: editAccount.value.height,
    weight: editAccount.value.weight,
    medical_condition: editAccount.value.medical_condition,
  }
  console.log('Data', data);

  emit('update:dialogVisible', false);
}




</script>

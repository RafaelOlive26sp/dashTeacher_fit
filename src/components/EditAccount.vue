<template>
  <v-container>

    <v-row dense>
      <slot name="content"></slot>
  <!--    <v-col cols="12" md="4" sm="6">-->
  <!--      <v-text-field label="Nome" v-model="editAccount.name"></v-text-field>-->
  <!--    </v-col>-->

  <!--    <v-col cols="12" md="4" sm="6">-->
  <!--      <v-text-field hint="1.75" label="Altura" v-model="editAccount.height" type="number"></v-text-field>-->
  <!--    </v-col>-->

  <!--    <v-col cols="12" md="4" sm="6">-->
  <!--      <v-text-field hint="65.00" label="Peso*"  required v-model="editAccount.weight" type="number"></v-text-field>-->
  <!--    </v-col>-->
  <!--    <v-col cols="12" md="4" sm="6">-->
  <!--      <v-text-field label="Condição Medica*" persistent-hint required v-model="editAccount.medical_condition"></v-text-field>-->
  <!--    </v-col>-->

      <!-- <v-col cols="12" md="4" sm="6">
        <v-text-field label="Email*" required></v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="6">
        <v-text-field label="Password*" type="password" required></v-text-field>
      </v-col>

      <v-col cols="12" md="4" sm="6">
        <v-text-field label="Confirm Password*" type="password" required></v-text-field>
      </v-col> -->

      <!-- <v-col cols="12" sm="6">
        <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
      </v-col> -->

      <!-- <v-col cols="12" sm="6">
        <v-autocomplete
          :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
          label="Interests" auto-select-first multiple></v-autocomplete>
      </v-col> -->
    </v-row>

    <small class="text-caption text-medium-emphasis">*Campos Obrigatorios</small>


    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>

      <v-btn color="primary" text="Save" variant="tonal" @click="saveDialog"></v-btn>
    </v-card-actions>
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

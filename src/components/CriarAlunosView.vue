<template>
  <v-item-group selected-class="bg-primary">

    <v-container>
      <v-row justify="space-around">
        <v-col cols-12 md="4" v-for="itens in usersData()" :key="itens.id">
          <v-sheet class="mx-auto mb-4" elevation="7">
            <v-item v-slot="{ isSelected, toggle }">
              <v-card :variant="variant" class="mx-auto" :color="isSelected ? 'success' : ''" :subtitle="itens.email"
                :title="itens.name" @click="handleDialog(itens, toggle, isSelected)">
              </v-card>
            </v-item>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

  </v-item-group>



  <Dialogs v-model="dialogVisible" :title="dialogTitle" :confirmButtonText="dialogActionText" @confirm="handleConfirm">
    <EditAccount>
      <template v-slot:content>
        <v-col cols="" md="4" sm="6">
          <v-text-field label="Idade" v-model="editAccount.age" type="number"></v-text-field>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-text-field hint="1.75" label="Altura" v-model="editAccount.height" type="number"></v-text-field>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-text-field hint="65.00" label="Peso*" required v-model="editAccount.weight" type="number"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select label="Genero*" :items="itemGender" item-title="text" item-value="value" persistent-hint required
            v-model="editAccount.gender"></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select label="Fumante*" :items="itemSmoker" item-title="text" item-value="value" persistent-hint required
            v-model="editAccount.smoker" type=""></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-textarea row-height="20" rows="2" variant="filled" auto-grow label="Condição Medica*" persistent-hint
            required v-model="editAccount.medical_condition"></v-textarea>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select :items="itemPreviousExperience" item-title="text" item-value="value"
            hint="Praticou algum exercicio fisico nos ultimos 6 meses? " label="Experiência Anterior*" persistent-hint
            required v-model="editAccount.previous_experience"></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select :items="itemCurrentlyPraticing" item-title="text" item-value="value"
            label="Pratica algum esporte atualmente*" hint="Pratica Atividade Fisica Atualmente ? " persistent-hint
            required v-model="editAccount.currently_praticing"></v-select>
          {{ editAccount.currently_praticing }}
        </v-col>
      </template>
      <template v-slot:btnContent>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="createdProfileUser('close')"></v-btn>

          <v-btn color="primary" text="Save" variant="tonal" @click="createdProfileUser('save')"></v-btn>
        </v-card-actions>
      </template>
    </EditAccount>
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>

  </Dialogs>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </SnackBarsView>






</template>
<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { getUsersWitchIncompletedProfile, handleCreatedProfileUser } from "@/services/user.js";
import { useUserStore } from "@/stores/user.js";
import Dialogs from "@/components/Dialogs.vue";
import EditAccount from "@/components/EditAccount.vue";
import SnackBarsView from "./snackBar/SnackBarsView.vue";

const emit = defineEmits(["profileCreated"]);
const userStore = useUserStore();
const dialogVisible = ref(false);
const dialogTitle = ref("");
const snackbarMessage = ref("");
const snackbar = ref(false);
const editAccount = ref({
  Id: "",
  Age: "",
  height: "",
  weight: "",
  gender: "",
  smoker: " ",
  medical_condition: "",
  previous_experience: "",
  currently_praticing: "",
});
const itemGender = ref([
  { text: 'Masculino', value: 'male' },
  { text: 'Feminino', value: 'female' }
]);
const itemSmoker = ref([
  { text: 'Sim', value: "1" },
  { text: 'Não', value: "0" }
]);
const itemPreviousExperience = ref([
  { text: 'Sim', value: "1" },
  { text: 'Não', value: "0" }
]);
const itemCurrentlyPraticing = ref([
  { text: 'Sim', value: "1" },
  { text: 'Não', value: "0" }
]);





onMounted(() => {

  fetchUsers()
})

const fetchUsers = async () => {

  try {
    const response = await getUsersWitchIncompletedProfile()

    userStore.usersWithIncompleteProfile(response)
  } catch (e) {
    console.log(e)
  }
}
const usersData = () => userStore.usersIncompleteProfile;

const handleDialog = (item, toggle, isSelected) => {

  toggle();

  console.log('Selected ', isSelected)
  if (!isSelected) {
    dialogVisible.value = true;
    dialogTitle.value = `Titulo`;
    editAccount.value.Id = item.id;

  }
};
const createdProfileUser = async (data) => {

  if (data === 'close') {
    dialogVisible.value = false;
    return
  }
  try {
    const dataProfile = {
      id: editAccount.value.Id,
      age: editAccount.value.age,
      height: editAccount.value.height,
      weight: editAccount.value.weight,
      gender: editAccount.value.gender,
      smoker: editAccount.value.smoker,
      medical_condition: editAccount.value.medical_condition,
      previous_experience: editAccount.value.previous_experience,
      currently_praticing: editAccount.value.currently_praticing,
    }
    const response = await handleCreatedProfileUser(dataProfile)

    if (response.status === 201) {
      fetchUsers()
      dialogVisible.value = false;
      emit('profileCreated')
      snackbarMessage.value = 'Perfil criado com sucesso'
      snackbar.value = true
    }

  } catch (e) {

    snackbarMessage.value = 'Erro ao criar perfil'
    snackbar.value = true
    throw new Error("Erro ao criar perfil");
  }
}

</script>

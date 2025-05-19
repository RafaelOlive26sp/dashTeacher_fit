<template>
  <v-item-group selected-class="bg-primary">

    <v-container>
      <v-row justify="space-around">
        <v-col cols="12" sm="6" md="4" lg="3" class="mb-1"  v-for="itens in usersData()" :key="itens.id">
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
          <v-text-field label="Idade*" v-model="editAccount.age" type="number" :rules="[rules.required, rules.idade, rules.noCaracterSpecial ]"></v-text-field>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-text-field :hint="[(editAccount.height / 100).toFixed(2)+' Alt']" label="Altura*" v-model="editAccount.height" type="number" :rules="[rules.min, rules.required, rules.noCaracterSpecial]"></v-text-field>
        </v-col>

        <v-col cols="12" md="4" sm="6">
          <v-text-field  label="Peso*" required v-model="editAccount.weight" type="number" :rules="[rules.required, rules.noCaracterSpecial]"></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select label="Genero*" :items="itemGender" item-title="text" item-value="value" persistent-hint required
            v-model="editAccount.gender" :rules="[rules.required]"></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select label="Fumante*" :items="itemSmoker" item-title="text" item-value="value" persistent-hint required
            v-model="editAccount.smoker" :rules="[rules.required]"></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-textarea row-height="20" rows="2" variant="filled" auto-grow label="Condição Medica*" persistent-hint
            required v-model="editAccount.medical_condition" :rules="[rules.min, rules.required, rules.noCaracterSpecial]"></v-textarea>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select :items="itemPreviousExperience" item-title="text" item-value="value"
            hint="Praticou algum exercicio fisico nos ultimos 6 meses? " label="Experiência Anterior*" persistent-hint
            required v-model="editAccount.previous_experience" :rules="[rules.required]"></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select :items="itemCurrentlyPraticing" item-title="text" item-value="value"
            label="Pratica algum esporte atualmente*" hint="Pratica Atividade Fisica Atualmente ? " persistent-hint
            required v-model="editAccount.currently_praticing" :rules="[rules.required]"></v-select>
        </v-col>
      </template>
      <template v-slot:btnContent>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Fechar" variant="plain" @click="createdProfileUser('close')"></v-btn>

          <v-btn color="primary" text="Salvar" variant="tonal" @click="createdProfileUser('save')"></v-btn>
        </v-card-actions>
      </template>
    </EditAccount>
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Fechar
      </v-btn>
    </template>

  </Dialogs>
  <SnackBarsView :textContent="snackbarMessage" v-model="snackbar">
    <template #actions>
      <v-btn color="pink" variant="text" @click="snackbar = false">
        Fechar
      </v-btn>
    </template>
  </SnackBarsView>

  <TutorialView v-model="showTutorial" title="Como criar um cadastro de aluno">
    <template v-slot:contentTutorial>
      <ul class="ml-4 mt-2">
        <li class="mb-1">Escolha um usuario.</li>
        <li class="mb-1">Selecione a <strong>idade</strong> do aluno.</li>
        <li class="mb-1">Defina a <strong>Altura</strong> do aluno.</li>
        <li class="mb-1">Defina o <strong>Peso</strong> do aluno.</li>
        <li class="mb-1">Defina o <strong>Sexo</strong> do aluno.</li>
        <li class="mb-1">Selecione se é <strong>Fumante</strong>.</li>
        <li class="mb-1">Se tem alguma restrição medica se  <strong>Não Houver</strong> Registre como <strong>NÃO TEM</strong>.</li>
        <li class="mb-1">Selecione se tem alguma experiencia anterior, como quando foi a ultima vez que praticou exercicios fisicos ou similares .</li>
        <li class="mb-1">E por fim selecione se ele pratica alguma atividade ou exercicio fisico atualmente.</li>
        <li class="mb-1">Clique em <strong>"Salvar"</strong> para criar o aluno.</li>
      </ul>
      <p class="mt-3">
        Os alunos criados serão exibidos na lista e ficarão disponíveis para os alunos agendarem suas aulas.
      </p>
    </template>
  </TutorialView>




</template>
<script setup>
import { onMounted, ref, defineEmits } from "vue";
import { getUsersWitchIncompletedProfile, handleCreatedProfileUser } from "@/services/user.js";
import { useUserStore } from "@/stores/user.js";
import Dialogs from "@/components/Dialogs.vue";
import EditAccount from "@/components/EditAccount.vue";
import SnackBarsView from "./snackBar/SnackBarsView.vue";
import TutorialView from "@/components/tutorial/TutorialView.vue";

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
const rules = {
  required: v => !!v || 'Campo Obrigatorio',
  idade: v => v >= 8 && v <= 99 || 'Idade Invalida',
  min: v => v?.length >= 3 || 'Minimo de 3 Caracteres',
  peso: v => v >= 10 && v <= 150 || 'Peso Invalido',
  noCaracterSpecial: v => /^[a-zA-Z0-9\s]*$/.test(v) || 'Caracteres Especiais não são permitidos',
  noCaracterSpecialCondMedica: v => /^[a-zA-Z]*$/.test(v) || 'Caracteres Especiais e números não são permitidos'
}





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

  // console.log('Selected ', isSelected)
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
      height: (editAccount.value.height / 100).toFixed(2),
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
    throw new Error(e,"Erro ao criar perfil");
  }
}

</script>

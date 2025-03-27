<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Instancia o router para navegação
const router = useRouter();

// Estado para o botão de ação
const isProfessor = ref(true); // Pode ser ajustado com base na autenticação do usuário

// Funções de navegação
const goToStudents = () => router.push('/alunos');
const goToPayments = () => router.push('/pagamentos');
const goToProfileCreation = () => router.push('/alunos');
</script>

<template>
  <v-container class="dashboard-container">
    <!-- Cabeçalho -->
    <v-row justify="center" class="text-center">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold primary--text">
          Bem-vindo ao Seu Sistema de Gestão!
        </h1>
        <p class="text-subtitle-1 mt-2">
          Gerencie seus alunos de Educação Física e Bem-Estar com facilidade.
        </p>
      </v-col>
    </v-row>

    <!-- Seção de Apresentação -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4 elevation-3">
          <v-card-title class="text-h6">
            <v-icon left color="primary">mdi-account-group</v-icon>
            Gerencie Seus Alunos
          </v-card-title>
          <v-card-text>
            Crie perfis para seus alunos, acompanhe o progresso deles e mantenha tudo organizado em um só lugar. Caso um aluno precise de ajuda, você pode criar o perfil por ele!
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="goToProfileCreation">
              Criar Perfil de Aluno
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 elevation-3">
          <v-card-title class="text-h6">
            <v-icon left color="primary">mdi-cash-register</v-icon>
            Agende Pagamentos
          </v-card-title>
          <v-card-text>
            Programe os pagamentos dos seus alunos de forma simples e prática. Tenha controle total sobre as finanças das suas aulas.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="goToPayments">
              Agendar Pagamento
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chamada para Ação -->
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" class="text-center">
        <v-alert type="info" outlined>
          <span class="font-weight-medium">
            Comece agora! Explore as ferramentas e simplifique sua rotina como professor.
          </span>
        </v-alert>
        <v-btn
          color="primary"
          large
          class="mt-4"
          @click="goToStudents"
        >
          Ver Lista de Alunos
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>

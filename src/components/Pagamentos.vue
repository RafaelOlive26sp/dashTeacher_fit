<template >
  <v-conteiner>
    <v-row aling="center" justify="center" class="ma-3 rounded">
      <v-col cols="3">
        <expansions_Panel colorIcon="warning" icon="mdi-cash-clock">
          <template v-slot:contentTitle>
            <p>Pagamentos Pendentes</p>
          </template>
          <template v-slot:content>
            <p>teste</p>
          </template>
        </expansions_Panel>
      </v-col>
      <v-col cols="3">
        <expansions_Panel colorIcon="success" icon="mdi-cash-check">
          <template v-slot:contentTitle>
            <p>Pagamentos Vigentes</p>
          </template>
          <template v-slot:content>
            <p>teste</p>
          </template>
        </expansions_Panel>
      </v-col>
      <v-col cols="3">
        <expansions_Panel colorIcon="error" icon="mdi-cash-remove">
          <template v-slot:contentTitle>
            <p>Pagamentos Vencidos</p>
          </template>
          <template v-slot:content>
            <p>teste</p>
          </template>
        </expansions_Panel>
      </v-col>
    </v-row>
  </v-conteiner>
</template>

<script setup>

</script>


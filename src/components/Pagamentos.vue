<template >
  <v-conteiner>
    <v-row aling="center" justify="center">
      <v-col cols="3">
        <v-card>
          <v-card-title>
            <v-icon color="warning">mdi-cash-clock</v-icon>
            <small>Pagamentos pendentes</small>
          </v-card-title>
          <v-card-text>
            <v-list>

            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-title>
            <v-icon color="success">mdi-cash-check</v-icon>
            <small>Pagamentos Vigentes</small>
          </v-card-title>
          <v-card-text>
            <v-list>

            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-title>
            <v-icon color="error">mdi-cash-remove</v-icon>
            <small>Pagamentos Vencidos</small>
          </v-card-title>
          <v-card-text>
            <v-list>

            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-conteiner>
</template>

<script setup>

</script>


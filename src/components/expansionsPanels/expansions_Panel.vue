<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <v-icon :color="props.colorIcon">{{ props.icon }}</v-icon>
        <slot name="contentTitle"></slot>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot name="content"></slot>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  colorIcon: {
    type: String,
    default: 'warning'
  },
  icon: {
    type: String,
    default: 'mdi-cash-clock'
  }
})

</script>
<style lang="">

</style>

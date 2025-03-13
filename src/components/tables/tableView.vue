<template>
  <v-table height="300px" fixed-header>
          <thead>
            <tr>
              <slot name="contentTHead" :class="props.classTh"></slot>
            </tr>
          </thead>
          
            <slot name="contentTr"></slot>
          
        </v-table>
</template>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  classTh:{
    type: String,
    default: 'text-left'
  }
})
</script>

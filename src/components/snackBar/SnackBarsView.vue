<template>
  <div class="text-center ma-2">
    <!-- <v-btn @click="snackbar = true">
      Open Snackbar
    </v-btn> -->
    <v-snackbar v-model="snackbar">
      {{ props.textContent }}


      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>

</template>


<script setup>
  import { ref } from 'vue'

  const props = defineProps({
    textContent:{
      type: String,
      default: 'Hello, I am a snackbar'
    }
  })

  const snackbar = ref(false)
  // const text = ref(`Hello, I'm a snackbar`)

</script>

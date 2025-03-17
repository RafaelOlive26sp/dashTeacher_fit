<template>
  <v-row justify="space-around">
    <v-col cols="12" md="6">
      <v-dialog v-model="isActive" transition="dialog-top-transition" width="auto">
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-toolbar title="Opening from the Top"></v-toolbar>

            <v-card-text class="text-h2 pa-12">
              Hello world!
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn text="Close" @click="isActive.value = false"></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup>
import {ref,watch} from 'vue'


const props = defineProps({
  showDialog: Boolean,
});

const emit = defineEmits(['update:showDialog']);

const isActive = ref(props.showDialog);

watch(isActive, (newVal) =>{
  emit('update:showDialog', newVal);
});


</script>

<template>
  <v-app>

    <!-- <AppHeader/> -->
    <NavBarLeft >
      <template v-slot:content >
        <v-main style="border:1px solid red">
          <router-view  />
        </v-main>
      </template>
    </NavBarLeft>

    <AppFooter />
  </v-app>
</template>

<script setup>
//
</script>

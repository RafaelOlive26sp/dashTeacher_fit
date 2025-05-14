<template>
  <v-app>

    <!-- <AppHeader/> -->
    <NavBarLeft >
      <template v-slot:content >
        <v-main >
          <router-view  />
        </v-main>
      </template>
    </NavBarLeft>

    <AppFooter />
  </v-app>
</template>

<template>
  <LoginView/>
  <DashboardView />
</template>

<script setup>
  //
import DashboardView from "@/pages/DashboardView.vue";
  import LoginView from "@/pages/LoginView.vue";
</script>


<style scoped>
.login-animated-background {
  background: linear-gradient(-45deg, #1e1e1e, #2c3e50, #34495e, #1e1e1e);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  min-height: 100vh;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

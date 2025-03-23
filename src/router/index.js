import {createRouter, createWebHistory} from 'vue-router'
import { useAuthStore} from "@/stores/auth.js";
import LoginView from "@/pages/LoginView.vue";
import DashboardView from "@/pages/DashboardView.vue";
import DafaultLayout from "@/layouts/default.vue";
import Pagamentos from '@/components/Pagamentos.vue';
// import { components } from 'vuetify/dist/vuetify-labs.js's;
import Alunos from '@/components/Alunos.vue';
import Agenda from '@/components/AgendamentosView.vue';



const routes = [
  {
    path: '/login',
    name: 'login',
    component:LoginView
  },
  {
    path:'/dashboard',
    name: 'dashboard',
    component: DafaultLayout,
    children:[
      {
        path:'',
        component: DashboardView,
      },
      {
        path:'/pagamentos',
        component: Pagamentos
      },
      {
        path:'/alunos',
        component: Alunos
      },
      {
        path:'/agenda',
        component:Agenda
      }
  ],
    meta:{requiresAuth: true}
  },
  {
    path:'/',
    redirect:'/dashboard'
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated){
    next({name: 'login'})
  }else{
    next()
  }
})

export default router

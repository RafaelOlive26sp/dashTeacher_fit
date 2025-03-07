import { defineStore } from "pinia";
import { login } from "@/services/auth";

export const useAuthStore = defineStore('auth',{
  state: () => ({
    user: null,
    token: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions:{
    async login(response,dispatch) {
      try {
        // console.log('response',response);
        console.log('----- ',response);

        this.token = response.access_token; // Acesse diretamente access_token
        this.user = response.user; // Acesse diretamente user
        localStorage.setItem('token', response.access_token); // Use access_token
        localStorage.setItem('user', JSON.stringify(response.user));
        dispatch
      } catch (error) {
        console.error(error);
        // throw new Error(error, 'Error logging in');

      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  }
})

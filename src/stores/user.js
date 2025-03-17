import {defineStore} from 'pinia'
// import router from '@/router'


export const useUserStore = defineStore('user',{
  state:()=>({
    payments:[],
    students:[]
  }),
  getters:{

  },
  actions:{
    async getPayment(response){
      try{
        // console.log('estamos em getPayments em actions', response);
        this.payments = response;


      }catch(error){
        console.error(error);
      }
    },
    async getStudentsWithUser(response){
      try{
        // console.log('estamos em getStudentsWithUser em actions', response);
        this.students = response;
      }catch(error){
        console.error(error);
        // throw new Error("error ao pegar estudantes", 'Error getting students', error);

      }
    }
  }
})


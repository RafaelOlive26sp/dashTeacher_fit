import {defineStore} from 'pinia'
import router from '@/router'


export const useUserStore = defineStore('user',{
  state:()=>({

}),
  getters:{

  },
  actions:{
    async getPayments(){
      try{

      }catch(error){
        console.error(error);
      }
    }
  }
})

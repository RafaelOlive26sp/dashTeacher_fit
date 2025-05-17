// import { loadClasses } from '@/services/user';
import {defineStore} from 'pinia'
// import router from '@/router'


export const useUserStore = defineStore('user',{
  state:()=>({
    payments:[],
    students:[],
    responseRemoveUser:[],
    usersIncompleteProfile:[],
    schedulesPaymentUsers:[],
    paymentConfirm:[],
    loadClasses:[],
    loadClassesCreate:[],
    shouldRefreshSchedules: false,
    successAppointmentUserData:[],
    dataScheduleStoreUsersClass:[],
    refreshNavBar: 0,



  }),
  getters:{

  },
  actions:{
    async getPayment(response){
      this.payments = response;
    },
    async getStudentsWithUser(response){


        this.students = response;

    },
    async removeUser(response) {

        this.responseRemoveUser = response;

    },
    async usersWithIncompleteProfile(response){


        this.usersIncompleteProfile = response.data;


    },
    async fetchPayments(response){

        this.schedulesPaymentUsers = response.data


    },
    async confirmPaymentStore(response){

        this.paymentConfirm = response.data

    },
    async loadDataSchedules(response){

        this.loadClasses = response.data


    },
    async loadCreatedClass(response){

        this.loadClassesCreate = response

    },
    async successAppointmentUser(response){

        this.successAppointmentUserData = response

    },
    async getDataScheduleStore(response){

        this.dataScheduleStoreUsersClass = response

    },
    triggerNavBarRefresh(){
      this.refreshNavBar++


    }

  }
})


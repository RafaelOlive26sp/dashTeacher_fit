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
    },
    async removeUser(response) {
      try {
        // console.log('response dentro de store ', response);

        this.responseRemoveUser = response;
      } catch (error) {
        console.log(error);

      }
    },
    async usersWithIncompleteProfile(response){
      try{

        this.usersIncompleteProfile = response.data;

      }catch(error){
        console.log(error);
      }
    },
    async fetchPayments(response){
      try{
      // console.log('estamos dentro de fetchPayments ',response)
        this.schedulesPaymentUsers = response.data

      }catch(error){
        console.error('error em store',error);
      }
    },
    async confirmPaymentStore(response){
      try {
        this.paymentConfirm = response.data
      } catch (error) {
        console.log(error);

      }
    },
    async loadDataSchedules(response){
      try {
        this.loadClasses = response.data
        // console.log('dados de loadDataSchedules ', response.data);

      } catch (error) {
        console.log(error);

      }
    },
    async loadCreatedClass(response){
      try {
        // console.log('resposta do back dentro de store ', response);
        this.loadClassesCreate = response
      } catch (error) {
        console.log(error);

      }
    },
    async successAppointmentUser(response){
      try {
        this.successAppointmentUserData = response
      }catch (e) {
        console.log(e)
      }
    },
    async getDataScheduleStore(response){
      try{
        this.dataScheduleStoreUsersClass = response
      }catch (e) {
        console.log(e)
      }
    },
    triggerNavBarRefresh(){
      this.refreshNavBar++
      console.log('estamos no trigger');

    }

  }
})


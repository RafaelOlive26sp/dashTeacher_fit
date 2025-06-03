import api from './api';
import Cookies from 'js-cookie';

export const getPayments = async () =>{
  try{
    const token = Cookies.get('access_token');
    if(!token){
      throw new Error('User not authenticated', 'Error getting payments');
    }
    const response = await api.get('/api/v1/payment/',{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.data
  }catch(error){
    console.error(error);
    throw new Error(error.response.data.message, 'Error getting payments');
  }
}
  export const getStudentsWithUser = async (page = 1, itemsPerPage = 5)=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.get('/api/v1/student',{
        headers:{
          Authorization: `Bearer ${token}`
        },
        params:{
          page,
          per_page: itemsPerPage
        }
      })
      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }

  export const getStudentsWithClass =async ()=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.get('/api/v1/clschedule',{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }


  export const removeUserApi = async (id)=>{
    try {
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.delete(`/api/v1/users/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error(error);
    }
  }
  export const getUsersWitchIncompletedProfile = async ()=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.get('/api/v1/users/',{
        headers:{
          Authorization: `Bearer ${token}`
        },

      })
      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }
  export const handleCreatedProfileUser = async (data)=>{
    try{

      const UserID = data.id;

      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }

      const response = await api.post(`/api/v1/student/${UserID}`,data,{
        headers:{
          Authorization: `Bearer ${token}`
        },

      })
      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }
  export const fetchPaymentUser = async (data)=>{
    try{

      const UserID = data.userId;

      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }

      const response = await api.post(`/api/v1/payment/${UserID}`,data,{
        headers:{
          Authorization: `Bearer ${token}`
        },

      })

      return response.data
    }catch(error){

      throw new Error(error.response.data.message, 'Error getting students');
    }
  }
  export const confirmPayment = async (data)=>{
    try {
      const UserID = data.id;
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }

      const response = await api.put(`/api/v1/payment/${UserID}`,data,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });

      return response.data


    } catch (error) {
      console.log(error);

    }
  }
  export const loadClasses = async ()=>{
    try {
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }

      const response = await api.get('/api/v1/schedules',{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })



      return response.data

    } catch (error) {
      console.log(error);

    }
  }
  export const createdClass = async (data)=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      // console.log('Data antes do post ',data);
      const response = await api.post('/api/v1/classes',data,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      return response.data

    }catch (e) {
      console.log(e)
    }
  }
  export const createdScheduleInClass = async (data)=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      // console.log('Data antes do post ',data);
      const response = await api.post('/api/v1/created/schedules/classes',data,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      return response.data

    }catch (e) {
      console.log(e)
    }
  }
  export const handleAppointmentUser = async (data)=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.post('/api/v1/clschedule',data,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }
  export const getDataScheduleCls = async ()=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.get('/api/v1/clschedule',{
        headers:{
          Authorization: `Bearer ${token}`
        },
      })


      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }
  export const updateStudentsInClass = async (data)=>{
    try{
      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      // console.log('Data antes do post ',data);
      const response = await api.put(`/api/v1/clschedule/${data.id}`,data,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      return response.data

    }catch (e) {
      console.log(e)
    }
  }



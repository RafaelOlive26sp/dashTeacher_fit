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
      console.log('Services ',response.data);

      return response.data
    }catch(error){
      console.error(error);
      throw new Error(error.response.data.message, 'Error getting students');
    }
  }
  export const removeUserApi = async (id)=>{
    try {
      console.log('antes da requisição ',id);

      const token = Cookies.get('access_token');
      if(!token){
        throw new Error('User not authenticated', 'Error getting students');
      }
      const response = await api.delete(`/api/v1/users/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      console.log(' resposta do back ',response);

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
      // console.log('Data antes do post ',data);
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



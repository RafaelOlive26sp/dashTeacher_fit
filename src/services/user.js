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

import api from "js-cookie";

export const getPayments = async () =>{
  try{
    const response = await api.get('/api/v1/payments')
    return response.data
  }catch(error){
    console.error(error);
  }
}

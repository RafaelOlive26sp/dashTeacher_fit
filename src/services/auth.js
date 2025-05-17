import api from "./api";


export const login = async (credentials) => {
  const response = await api.post('/api/login', credentials)
  return response.data
}

export const logout = async () => {
  const response = await api.post('/api/v1/logout')
  return response.data
}

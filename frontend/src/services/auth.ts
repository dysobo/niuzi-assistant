import api from './api'
import { AuthResponse, User } from '../types'

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { username, password })
  return data
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', { username, password })
  return data
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

import api from './api'
import { Achievement } from '../types'

export const getAchievements = async (): Promise<Achievement[]> => {
  const response = await api.get('/records/achievements')
  return response.data
}

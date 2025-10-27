import api from './api'
import { Record, Stats, DailyStats } from '../types'

export const startRecord = async (): Promise<Record> => {
  const { data } = await api.post<Record>('/records/start')
  return data
}

export const endRecord = async (recordId: number): Promise<Record> => {
  const { data } = await api.post<Record>(`/records/${recordId}/end`)
  return data
}

export const getRecords = async (): Promise<Record[]> => {
  const { data } = await api.get<Record[]>('/records')
  return data
}

export const deleteRecord = async (id: number): Promise<void> => {
  await api.delete(`/records/${id}`)
}

export const getStats = async (): Promise<Stats> => {
  const { data } = await api.get<Stats>('/records/stats')
  return data
}

export const getDailyStats = async (days: number = 30): Promise<DailyStats[]> => {
  const { data } = await api.get<DailyStats[]>(`/records/stats/daily?days=${days}`)
  return data
}

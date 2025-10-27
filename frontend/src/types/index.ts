export interface User {
  id: number
  username: string
  created_at: string
}

export interface Record {
  id: number
  user_id: number
  start_time: string
  end_time: string | null
  duration: number | null
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Stats {
  total_records: number
  total_duration: number
  avg_duration: number
  longest_duration: number
  streak_days: number
  last_30_days_count: number
}

export interface DailyStats {
  date: string
  count: number
  duration: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
}

import { useEffect, useState } from 'react'
import { Calendar, Badge } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { getRecords } from '../services/records'
import { Record } from '../types'

const CalendarView: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const data = await getRecords()
      setRecords(data)
    } catch (error) {
      console.error('加载记录失败', error)
    }
  }

  const getRecordsByDate = (date: Dayjs) => {
    return records.filter(record => {
      const recordDate = dayjs(record.start_time)
      return recordDate.isSame(date, 'day')
    })
  }

  const dateCellRender = (date: Dayjs) => {
    const dayRecords = getRecordsByDate(date)
    if (dayRecords.length === 0) return null

    return (
      <div style={{ marginTop: '4px' }}>
        <Badge count={dayRecords.length} style={{ backgroundColor: '#52c41a' }} />
      </div>
    )
  }

  const monthCellRender = (date: Dayjs) => {
    const monthRecords = records.filter(record => {
      const recordDate = dayjs(record.start_time)
      return recordDate.isSame(date, 'month')
    })
    if (monthRecords.length === 0) return null

    return (
      <div style={{ marginTop: '12px' }}>
        <div>本月共 {monthRecords.length} 次记录</div>
      </div>
    )
  }

  return (
    <Calendar
      dateCellRender={dateCellRender}
      monthCellRender={monthCellRender}
    />
  )
}

export default CalendarView

import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { getDailyStats } from '../services/records'
import { DailyStats } from '../types'
import dayjs from 'dayjs'

const StatsChart: React.FC = () => {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDailyStats()
  }, [])

  const loadDailyStats = async () => {
    try {
      const data = await getDailyStats(30)
      setDailyStats(data)
    } catch (error) {
      console.error('加载统计数据失败', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  const chartData = {
    dates: dailyStats.map(item => dayjs(item.date).format('MM/DD')),
    counts: dailyStats.map(item => item.count),
    durations: dailyStats.map(item => Math.floor(item.duration / 60)),
  }

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['次数', '时长(分钟)'],
    },
    xAxis: {
      type: 'category',
      data: chartData.dates,
    },
    yAxis: [
      {
        type: 'value',
        name: '次数',
        position: 'left',
      },
      {
        type: 'value',
        name: '时长(分钟)',
        position: 'right',
      },
    ],
    series: [
      {
        name: '次数',
        type: 'bar',
        data: chartData.counts,
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: '时长(分钟)',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.durations,
        itemStyle: {
          color: '#52c41a',
        },
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: '400px' }} />
}

export default StatsChart

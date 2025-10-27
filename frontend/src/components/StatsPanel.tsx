import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import { getStats } from '../services/records'
import { Stats } from '../types'

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getStats()
      setStats(data)
    } catch (error) {
      console.error('加载统计失败', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}秒`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`
    return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分钟`
  }

  if (loading || !stats) {
    return null
  }

  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总记录数"
            value={stats.total_records}
            suffix="次"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="总时长"
            value={stats.total_duration}
            formatter={(value) => formatDuration(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="平均时长"
            value={stats.avg_duration}
            formatter={(value) => formatDuration(Number(value))}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="连续打卡"
            value={stats.streak_days}
            suffix="天"
          />
        </Card>
      </Col>
    </Row>
  )
}

export default StatsPanel

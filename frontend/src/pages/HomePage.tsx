import { useState } from 'react'
import { Layout, Button, Card, Typography, Space, message, Popconfirm } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import TimerButton from '../components/TimerButton'
import CalendarView from '../components/CalendarView'
import StatsChart from '../components/StatsChart'
import StatsPanel from '../components/StatsPanel'
import AchievementsPanel from '../components/AchievementsPanel'
import './HomePage.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

const HomePage: React.FC = () => {
  const { user, logout } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      message.success('已退出登录')
    } catch (error) {
      message.error('退出失败')
    }
  }

  const handleRefresh = () => {
    setRefreshing(!refreshing)
  }

  return (
    <Layout className="home-layout">
      <Header className="home-header">
        <Space>
          <Title level={3} style={{ margin: 0, color: '#fff' }}>
            🐂 牛子小助手
          </Title>
          <Text style={{ color: '#fff', opacity: 0.8 }}>
            欢迎，{user?.username}
          </Text>
        </Space>
        <Popconfirm
          title="确定要退出登录吗？"
          onConfirm={handleLogout}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" icon={<LogoutOutlined />} style={{ color: '#fff' }}>
            退出
          </Button>
        </Popconfirm>
      </Header>
      <Content className="home-content">
        <div className="app-container">
          <Card className="main-card">
            <TimerButton onRefresh={handleRefresh} />
          </Card>

          <div className="stats-section">
            <StatsPanel key={refreshing ? '1' : '0'} />
          </div>

          <div className="achievements-section">
            <AchievementsPanel key={refreshing ? '1' : '0'} />
          </div>

          <div className="chart-section">
            <Card title="📊 近30天频次统计">
              <StatsChart key={refreshing ? '1' : '0'} />
            </Card>
          </div>

          <div className="calendar-section">
            <Card title="📅 打卡日历">
              <CalendarView key={refreshing ? '1' : '0'} />
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default HomePage

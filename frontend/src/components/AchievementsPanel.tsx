import { useEffect, useState } from 'react'
import { Card, Badge, Progress, Empty, Button } from 'antd'
import { TrophyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { getAchievements } from '../services/achievements'
import { Achievement } from '../types'
import '../components/AchievementsPanel.css'

const AchievementsPanel: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const data = await getAchievements()
      // 将已解锁的成就排在前面
      const sorted = [...data].sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1
        if (!a.unlocked && b.unlocked) return 1
        return 0
      })
      setAchievements(sorted)
    } catch (error) {
      console.error('加载成就失败', error)
    } finally {
      setLoading(false)
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  if (loading) {
    return <Card title="🏆 我的成就" loading />
  }

  return (
    <Card className="achievements-card" title="🏆 我的成就">
      <div className="achievements-summary">
        <Badge count={unlockedCount} showZero>
          <TrophyOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        </Badge>
        <span className="achievements-text">
          已解锁 {unlockedCount} / {totalCount} 个成就
        </span>
      </div>

      {/* 已解锁的成就 */}
      {unlockedCount > 0 && (
        <div className="achievements-unlocked-section">
          <h3 className="achievements-section-title">✨ 已解锁成就</h3>
          <div className="achievements-list">
            {achievements
              .filter(a => a.unlocked)
              .map(achievement => (
                <div
                  key={achievement.id}
                  className="achievement-item unlocked"
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-content">
                    <div className="achievement-header">
                      <span className="achievement-name">{achievement.name}</span>
                      <Badge status="success" text="已解锁" />
                    </div>
                    <div className="achievement-description">{achievement.description}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 未解锁的成就 */}
      {lockedAchievements.length > 0 && (
        <div className="achievements-locked-section">
          <div className="achievements-section-header">
            <h3 className="achievements-section-title">🔒 未解锁成就 ({lockedAchievements.length})</h3>
            <Button
              type="link"
              icon={showAll ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setShowAll(!showAll)}
              className="toggle-button"
            >
              {showAll ? '收起' : '查看更多'}
            </Button>
          </div>
          
          {showAll && (
            <div className="achievements-list">
              {lockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="achievement-item locked"
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-content">
                    <div className="achievement-header">
                      <span className="achievement-name">{achievement.name}</span>
                    </div>
                    <div className="achievement-description">{achievement.description}</div>
                    {achievement.target > 1 && (
                      <Progress
                        percent={Math.round((achievement.progress / achievement.target) * 100)}
                        size="small"
                        format={() => `${achievement.progress} / ${achievement.target}`}
                        strokeColor="#1890ff"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {achievements.length === 0 && (
        <Empty description="暂无成就" />
      )}
    </Card>
  )
}

export default AchievementsPanel

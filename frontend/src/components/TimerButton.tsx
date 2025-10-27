import { useState, useEffect, useRef } from 'react'
import { Button, message, Modal, Space, Typography } from 'antd'
import { PlayCircleOutlined, StopOutlined } from '@ant-design/icons'
import { startRecord, endRecord } from '../services/records'
import { Record } from '../types'
import dayjs from 'dayjs'

const { Text } = Typography

interface TimerButtonProps {
  onRefresh: () => void
}

const TimerButton: React.FC<TimerButtonProps> = ({ onRefresh }) => {
  const [isTiming, setIsTiming] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isTiming && currentRecord) {
      intervalRef.current = setInterval(() => {
        const now = dayjs()
        const start = dayjs(currentRecord.start_time)
        const diff = now.diff(start, 'second')
        setDuration(diff)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTiming, currentRecord])

  const handleStart = async () => {
    try {
      const record = await startRecord()
      setCurrentRecord(record)
      setIsTiming(true)
      setDuration(0)
      message.success('开始记录')
    } catch (error: any) {
      message.error(error.response?.data?.message || '开始记录失败')
    }
  }

  const handleStop = () => {
    Modal.confirm({
      title: '结束记录',
      content: `当前已记录 ${formatDuration(duration)}，确定要结束吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          if (currentRecord) {
            await endRecord(currentRecord.id)
            message.success('记录已保存')
            setIsTiming(false)
            setDuration(0)
            setCurrentRecord(null)
            onRefresh()
          }
        } catch (error: any) {
          message.error(error.response?.data?.message || '结束记录失败')
        }
      },
    })
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {isTiming ? (
        <>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#52c41a' }}>
            {formatDuration(duration)}
          </div>
          <div>
            <Text type="secondary">正在记录中...</Text>
          </div>
          <Button
            type="primary"
            danger
            size="large"
            icon={<StopOutlined />}
            onClick={handleStop}
            style={{ height: '60px', fontSize: '18px', minWidth: '200px' }}
          >
            结束记录
          </Button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1890ff' }}>
            00:00:00
          </div>
          <div>
            <Text type="secondary">点击按钮开始记录</Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
            style={{ height: '60px', fontSize: '18px', minWidth: '200px' }}
          >
            开始记录
          </Button>
        </>
      )}
    </Space>
  )
}

export default TimerButton

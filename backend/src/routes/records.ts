import { Router, Request, Response } from 'express'
import Record from '../models/Record'
import { authenticate } from '../middleware/auth'
import { AchievementsService } from '../services/achievements'

const router = Router()

router.post('/start', authenticate, async (req: any, res: Response) => {
  try {
    const activeRecord = await Record.findOne({
      where: {
        user_id: req.user.id,
        end_time: null,
      },
    })

    if (activeRecord) {
      return res.status(400).json({ message: '已有未结束的记录' })
    }

    const record = await Record.create({
      user_id: req.user.id,
      start_time: new Date(),
    } as any)

    res.status(201).json(record)
  } catch (error) {
    console.error('开始记录错误:', error)
    res.status(500).json({ message: '开始记录失败' })
  }
})

router.post('/:id/end', authenticate, async (req: any, res: Response) => {
  try {
    const record = await Record.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
        end_time: null,
      },
    })

    if (!record) {
      return res.status(404).json({ message: '记录不存在' })
    }

    const end_time = new Date()
    const duration = Math.floor((end_time.getTime() - record.start_time.getTime()) / 1000)

    await record.update({ end_time, duration })

    res.json(record)
  } catch (error) {
    console.error('结束记录错误:', error)
    res.status(500).json({ message: '结束记录失败' })
  }
})

router.get('/', authenticate, async (req: any, res: Response) => {
  try {
    const records = await Record.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
    })

    res.json(records)
  } catch (error) {
    console.error('获取记录列表错误:', error)
    res.status(500).json({ message: '获取记录列表失败' })
  }
})

router.delete('/:id', authenticate, async (req: any, res: Response) => {
  try {
    const record = await Record.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })

    if (!record) {
      return res.status(404).json({ message: '记录不存在' })
    }

    await record.destroy()
    res.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除记录错误:', error)
    res.status(500).json({ message: '删除记录失败' })
  }
})

router.get('/stats', authenticate, async (req: any, res: Response) => {
  try {
    const records = await Record.findAll({
      where: { user_id: req.user.id },
    })

    const total_records = records.length
    const total_duration = records
      .filter(r => r.duration)
      .reduce((sum, r) => sum + (r.duration || 0), 0)
    const avg_duration = total_records > 0 ? Math.floor(total_duration / total_records) : 0
    const longest_duration = records.reduce((max, r) => Math.max(max, r.duration || 0), 0)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const last_30_days_count = records.filter(r => new Date(r.start_time) >= thirtyDaysAgo).length

    let streak_days = 0
    const sortedRecords = records
      .filter(r => r.end_time)
      .sort((a, b) => b.start_time.getTime() - a.start_time.getTime())

    if (sortedRecords.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      let currentDate = today
      let index = 0

      while (index < sortedRecords.length) {
        const recordDate = new Date(sortedRecords[index].start_time)
        recordDate.setHours(0, 0, 0, 0)

        if (recordDate.getTime() === currentDate.getTime()) {
          streak_days++
          currentDate.setDate(currentDate.getDate() - 1)
          index++
        } else if (recordDate.getTime() < currentDate.getTime()) {
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          index++
        }
      }
    }

    res.json({
      total_records,
      total_duration,
      avg_duration,
      longest_duration,
      streak_days,
      last_30_days_count,
    })
  } catch (error) {
    console.error('获取统计信息错误:', error)
    res.status(500).json({ message: '获取统计信息失败' })
  }
})

router.get('/achievements', authenticate, async (req: any, res: Response) => {
  try {
    const achievements = await AchievementsService.calculateAchievements(req.user.id)
    res.json(achievements)
  } catch (error) {
    console.error('获取成就错误:', error)
    res.status(500).json({ message: '获取成就失败' })
  }
})

export default router

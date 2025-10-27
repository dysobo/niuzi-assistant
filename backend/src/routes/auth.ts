import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password_hash } as any)

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn } as any
    )

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
      token,
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '注册失败' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn } as any
    )

    res.json({
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
      token,
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '登录失败' })
  }
})

router.get('/me', authenticate, async (req: any, res: Response) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'created_at'],
    })

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    res.json(user)
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({ message: '获取用户信息失败' })
  }
})

router.post('/logout', (req: Request, res: Response) => {
  res.json({ message: '退出登录成功' })
})

export default router

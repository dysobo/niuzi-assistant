import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: number
      username: string
    }

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: '无效的认证令牌' })
  }
}

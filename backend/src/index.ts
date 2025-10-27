import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import recordRoutes from './routes/records'
import { sequelize } from './db'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/records', recordRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '牛子小助手API运行正常' })
})

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ 数据库连接成功')
    console.log(`🚀 服务器运行在端口 ${PORT}`)
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
  }
})

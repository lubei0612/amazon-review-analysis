// ====================================
// Amazon评论分析系统 - 后端服务器
// ====================================

// ✅ 第一步：加载环境变量（必须在最顶部）
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')
const apiRoutes = require('./src/services/ApiRoutes')

// 初始化Express应用
const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// 请求日志
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// API路由
app.use('/api', apiRoutes)

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'Amazon评论分析服务运行中',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      createTask: 'POST /api/tasks/create',
      getTaskStatus: 'GET /api/tasks/:taskId/status',
      getTaskResult: 'GET /api/tasks/:taskId/result',
      getAllTasks: 'GET /api/tasks'
    }
  })
})

// 错误处理
app.use((err, req, res, next) => {
  logger.error('服务器错误:', err.message)
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  })
})

// 启动服务器
app.listen(PORT, () => {
  logger.info('╔════════════════════════════════════════════╗')
  logger.info('║   Amazon评论分析系统 - 后端服务器         ║')
  logger.info('╚════════════════════════════════════════════╝')
  logger.info(`🚀 服务器运行在: http://localhost:${PORT}`)
  logger.info(`📌 环境: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🤖 AI Provider: Gemini 2.5 Pro`)
  logger.info(`📡 Outscraper: ${process.env.OUTSCRAPER_API_KEY ? '✅ 已配置' : '❌ 未配置'}`)
  logger.info('═══════════════════════════════════════════════')
})

// 优雅退出
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号，正在关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('收到SIGINT信号，正在关闭服务器...')
  process.exit(0)
})

module.exports = app





// ========================
// API路由定义
// ========================

const express = require('express')
const router = express.Router()
const taskService = require('./TaskService')
const logger = require('../../utils/logger')

/**
 * 健康检查
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Amazon评论分析服务运行中',
    timestamp: new Date()
  })
})

/**
 * 创建分析任务
 * POST /api/tasks/create
 */
router.post('/tasks/create', async (req, res) => {
  try {
    const { productUrl, asin, reviewCount, source, analysisOptions, analysisMode } = req.body
    
    // ✅ 简化验证：只需要 asin（可从productUrl提取）
    if (!asin && !productUrl) {
      return res.status(400).json({
        success: false,
        message: '缺少必填参数: 至少需要 asin 或 productUrl'
      })
    }
    
    // 如果只有productUrl，尝试提取ASIN
    let finalAsin = asin
    if (!finalAsin && productUrl) {
      const match = productUrl.match(/\/dp\/([A-Z0-9]{10})/)
      if (match) {
        finalAsin = match[1]
      }
    }
    
    if (!finalAsin) {
      return res.status(400).json({
        success: false,
        message: '无法从URL中提取ASIN，请提供正确的Amazon产品链接'
      })
    }
    
    const mode = analysisMode || 'full'  // 默认为完整分析
    logger.info(`收到分析请求: ASIN ${finalAsin}, 模式: ${mode}, 评论数: ${reviewCount || '默认'} (来源: ${source || 'unknown'})`)
    
    const taskId = await taskService.createTask({
      productUrl: productUrl || `https://www.amazon.com/dp/${finalAsin}`,
      asin: finalAsin,
      reviewCount,
      analysisOptions,
      analysisMode: mode  // ✅ 传递分析模式
    })
    
    res.json({
      success: true,
      message: '任务创建成功',
      data: {
        taskId,
        status: 'pending'
      }
    })
  } catch (error) {
    logger.error('创建任务失败:', error.message)
    
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * 查询任务状态
 * GET /api/tasks/:taskId/status
 */
router.get('/tasks/:taskId/status', (req, res) => {
  try {
    const { taskId } = req.params
    
    const task = taskService.getTask(taskId)
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: '任务不存在'
      })
    }
    
    res.json({
      success: true,
      data: {
        taskId: task.taskId,
        status: task.status,
        progress: task.progress,
        result: task.result,
        error: task.error,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }
    })
  } catch (error) {
    logger.error('查询任务失败:', error.message)
    
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * 获取任务结果
 * GET /api/tasks/:taskId/result
 */
router.get('/tasks/:taskId/result', (req, res) => {
  try {
    const { taskId } = req.params
    
    const task = taskService.getTask(taskId)
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: '任务不存在'
      })
    }
    
    if (task.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: '任务尚未完成',
        status: task.status
      })
    }
    
    res.json({
      success: true,
      data: task.result
    })
  } catch (error) {
    logger.error('获取任务结果失败:', error.message)
    
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * 获取所有任务列表
 * GET /api/tasks
 */
router.get('/tasks', (req, res) => {
  try {
    const tasks = taskService.getAllTasks()
    
    // 只返回基本信息，不包含result
    const taskList = tasks.map(task => ({
      taskId: task.taskId,
      asin: task.asin,
      status: task.status,
      progress: task.progress,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }))
    
    res.json({
      success: true,
      data: taskList
    })
  } catch (error) {
    logger.error('获取任务列表失败:', error.message)
    
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

/**
 * 删除任务
 * DELETE /api/tasks/:taskId
 */
router.delete('/tasks/:taskId', (req, res) => {
  try {
    const { taskId } = req.params
    
    const deleted = taskService.deleteTask(taskId)
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: '任务不存在'
      })
    }
    
    res.json({
      success: true,
      message: '任务已删除'
    })
  } catch (error) {
    logger.error('删除任务失败:', error.message)
    
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router










































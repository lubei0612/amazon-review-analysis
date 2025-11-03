// ========================
// 简单日志工具
// ========================

const logger = {
  info: (...args) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN')
    console.log(`[INFO] ${timestamp}`, ...args)
  },
  
  warn: (...args) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN')
    console.warn(`[WARN] ${timestamp}`, ...args)
  },
  
  error: (...args) => {
    const timestamp = new Date().toLocaleTimeString('zh-CN')
    console.error(`[ERROR] ${timestamp}`, ...args)
  },
  
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toLocaleTimeString('zh-CN')
      console.log(`[DEBUG] ${timestamp}`, ...args)
    }
  }
}

module.exports = logger


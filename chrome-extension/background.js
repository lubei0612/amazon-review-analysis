// ========================
// Service Worker - 后台脚本
// ========================

const API_BASE_URL = 'http://localhost:3001/api'

// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Amazon评论分析助手已安装')
})

// 监听来自Content Script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkHealth') {
    handleCheckHealth(sendResponse)
    return true
  }
  
  if (request.action === 'startAnalysis') {
    handleStartAnalysis(request.data, sendResponse)
    return true
  }
  
  if (request.action === 'checkTaskStatus') {
    handleCheckTaskStatus(request.taskId, sendResponse)
    return true
  }
})

// 健康检查
async function handleCheckHealth(sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    const result = await response.json()
    sendResponse({ success: true, data: result })
  } catch (error) {
    sendResponse({ success: false, error: error.message })
  }
}


// 开始分析任务（简化版：无需Cookies，API Key在后端配置）
async function handleStartAnalysis(data, sendResponse) {
  try {
    console.log('=== 开始分析任务 ===')
    console.log('ASIN:', data.asin)
    console.log('Product URL:', data.productUrl)
    
    // ✅ 简化：直接调用后端API，无需Cookies和API Key
    // 后端将使用Outscraper/RapidAPI爬取评论，无需用户登录信息
    const response = await fetch(`${API_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asin: data.asin,
        productUrl: data.productUrl,
        reviewCount: data.reviewCount,
        source: 'chrome-extension',
        analysisOptions: data.analysisOptions || {
          enableConsumerProfile: true,
          enableUsageScenarios: true,
          enableStarRating: true,
          enableProductExperience: true,
          enablePurchaseMotivation: true,
          enableUnmetNeeds: true
        }
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ 任务创建成功，TaskID:', result.data.taskId)
      sendResponse({ 
        success: true, 
        taskId: result.data.taskId,
        message: '分析任务已创建'
      })
    } else {
      console.error('❌ 任务创建失败:', result.message)
      sendResponse({ success: false, error: result.message })
    }
  } catch (error) {
    console.error('❌ 分析任务错误:', error)
    sendResponse({ success: false, error: error.message })
  }
}

// 检查任务状态
async function handleCheckTaskStatus(taskId, sendResponse) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`)
    const result = await response.json()
    
    sendResponse({ 
      success: true, 
      status: result.data.status,
      progress: result.data.progress,
      result: result.data.result
    })
  } catch (error) {
    sendResponse({ success: false, error: error.message })
  }
}

// 监听Tab更新（自动检测产品页面）
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isAmazonProduct = /amazon\.com\/.*(\/dp\/|\/product\/)([A-Z0-9]{10})/.test(tab.url)
    
    if (isAmazonProduct) {
      chrome.action.setBadgeText({ text: '✓', tabId })
      chrome.action.setBadgeBackgroundColor({ color: '#10B981', tabId })
    } else {
      chrome.action.setBadgeText({ text: '', tabId })
    }
  }
})

















































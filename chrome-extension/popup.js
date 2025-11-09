// ========================
// Popup Script - 弹窗逻辑
// ========================

let currentProductInfo = null

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载配置（服务器地址 + API Key）
  loadApiKeyStatus()
  loadServerConfig()
  
  // 刷新产品信息
  refreshProductInfo()
  
  // 绑定按钮事件
  document.getElementById('analyze-btn').addEventListener('click', startAnalysis)
  document.getElementById('refresh-btn').addEventListener('click', refreshProductInfo)
  document.getElementById('settings-toggle-btn').addEventListener('click', toggleSettings)
  document.getElementById('save-api-key-btn').addEventListener('click', saveConfig)
  document.getElementById('test-api-btn').addEventListener('click', testApiConnection)
  
  // 绑定 AI Provider 切换事件
  document.getElementById('ai-provider-select').addEventListener('change', handleProviderChange)
})

// 刷新产品信息
async function refreshProductInfo() {
  const pageStatus = document.getElementById('page-status')
  const reviewCount = document.getElementById('review-count')
  const rating = document.getElementById('rating')
  const analyzeBtn = document.getElementById('analyze-btn')
  const errorDiv = document.getElementById('error')
  
  try {
    // 获取当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
    // 检查是否是Amazon产品页
    if (!tab.url || !/amazon\.com\/.*(\/dp\/|\/product\/)/.test(tab.url)) {
      pageStatus.textContent = '❌ 非产品页'
      analyzeBtn.disabled = true
      return
    }
    
    // 向Content Script发送消息
    const response = await chrome.tabs.sendMessage(tab.id, { 
      action: 'getProductInfo' 
    })
    
    if (response.success && response.data) {
      currentProductInfo = response.data
      
      pageStatus.textContent = '✅ 产品页'
      reviewCount.textContent = `${currentProductInfo.reviewCount.toLocaleString()} 条`
      rating.textContent = `⭐ ${currentProductInfo.rating.toFixed(1)}`
      
      analyzeBtn.disabled = false
      errorDiv.classList.remove('active')
    } else {
      throw new Error('无法提取产品信息')
    }
  } catch (error) {
    console.error('刷新失败:', error)
    pageStatus.textContent = '❌ 获取失败'
    analyzeBtn.disabled = true
    
    // 显示错误信息
    errorDiv.textContent = `错误: ${error.message}`
    errorDiv.classList.add('active')
  }
}

// 开始分析
async function startAnalysis() {
  if (!currentProductInfo) {
    alert('请先刷新产品信息')
    return
  }
  
  const analyzeBtn = document.getElementById('analyze-btn')
  const loading = document.getElementById('loading')
  const errorDiv = document.getElementById('error')
  
  analyzeBtn.disabled = true
  loading.classList.add('active')
  errorDiv.classList.remove('active')
  
  try {
    // 发送消息到Background Script
    const response = await chrome.runtime.sendMessage({
      action: 'startAnalysis',
      data: currentProductInfo
    })
    
    if (response.success) {
      // 获取配置的前端URL
      const config = await chrome.storage.local.get(['frontendUrl'])
      const frontendUrl = config.frontendUrl || 'http://43.130.35.117:8089'
      
      // 任务创建成功，打开报告页面
      const reportUrl = `${frontendUrl}/#/report/${response.taskId}`
      chrome.tabs.create({ url: reportUrl })
      
      // 关闭popup
      window.close()
    } else {
      throw new Error(response.error || '任务创建失败')
    }
  } catch (error) {
    console.error('分析失败:', error)
    errorDiv.textContent = `分析失败: ${error.message}`
    errorDiv.classList.add('active')
    analyzeBtn.disabled = false
  } finally {
    loading.classList.remove('active')
  }
}

// ========================
// 配置管理功能
// ========================

// 加载服务器配置
async function loadServerConfig() {
  try {
    const result = await chrome.storage.local.get(['serverUrl', 'frontendUrl'])
    const serverUrl = result.serverUrl || 'http://43.130.35.117:8088'
    const frontendUrl = result.frontendUrl || 'http://43.130.35.117:8089'
    
    document.getElementById('server-url-input').value = serverUrl
    document.getElementById('frontend-url-input').value = frontendUrl
    
    console.log('服务器配置已加载:', { serverUrl, frontendUrl })
  } catch (error) {
    console.error('加载服务器配置失败:', error)
  }
}

// 加载 API Key 状态
async function loadApiKeyStatus() {
  try {
    const result = await chrome.storage.local.get(['geminiApiKey', 'aiProvider', 'serverUrl'])
    const apiKey = result.geminiApiKey
    const provider = result.aiProvider || 'gemini'
    const serverUrl = result.serverUrl || 'http://43.130.35.117:8088'
    
    const apiStatus = document.getElementById('api-status')
    const apiInput = document.getElementById('api-key-input')
    const providerSelect = document.getElementById('ai-provider-select')
    
    // 设置 Provider 选择器
    if (providerSelect) {
      providerSelect.value = provider
      handleProviderChange({ target: { value: provider } })
    }
    
    if (apiKey && serverUrl !== 'http://43.130.35.117:8088') {
      // API Key 和服务器都已配置（自定义服务器）
      apiInput.value = apiKey
      apiStatus.textContent = `✅ 已配置 (自定义服务器)`
      apiStatus.className = 'api-status success'
    } else if (serverUrl === 'http://43.130.35.117:8088') {
      // 使用默认服务器
      apiStatus.textContent = `✅ 使用默认服务器`
      apiStatus.className = 'api-status success'
    } else {
      apiStatus.textContent = '❌ 未配置'
      apiStatus.className = 'api-status error'
    }
  } catch (error) {
    console.error('加载 API 配置失败:', error)
  }
}

// 切换设置面板显示/隐藏
function toggleSettings() {
  const settingsPanel = document.getElementById('settings-panel')
  if (settingsPanel.style.display === 'none') {
    settingsPanel.style.display = 'block'
  } else {
    settingsPanel.style.display = 'none'
  }
}

// 保存所有配置（服务器地址 + API Key）
async function saveConfig() {
  const serverUrl = document.getElementById('server-url-input').value.trim() || 'http://43.130.35.117:8088'
  const frontendUrl = document.getElementById('frontend-url-input').value.trim() || 'http://43.130.35.117:8089'
  const apiKey = document.getElementById('api-key-input').value.trim()
  const provider = document.getElementById('ai-provider-select').value
  const apiStatus = document.getElementById('api-status')
  
  // 验证URL格式
  try {
    new URL(serverUrl)
    new URL(frontendUrl)
  } catch (error) {
    apiStatus.textContent = '❌ URL格式不正确'
    apiStatus.className = 'api-status error'
    return
  }
  
  try {
    // 保存所有配置
    await chrome.storage.local.set({ 
      serverUrl: serverUrl,
      frontendUrl: frontendUrl,
      geminiApiKey: apiKey,
      aiProvider: provider
    })
    
    // 通知 background.js 更新配置
    await chrome.runtime.sendMessage({ 
      action: 'updateConfig', 
      config: { serverUrl, frontendUrl, apiKey, provider } 
    })
    
    apiStatus.textContent = `✅ 配置已保存`
    apiStatus.className = 'api-status success'
    
    console.log('配置已保存:', { serverUrl, frontendUrl, provider })
    
    // 2秒后自动隐藏设置面板
    setTimeout(() => {
      document.getElementById('settings-panel').style.display = 'none'
    }, 2000)
    
  } catch (error) {
    apiStatus.textContent = '❌ 保存失败'
    apiStatus.className = 'api-status error'
    console.error('保存配置失败:', error)
  }
}

// 测试服务器连接
async function testApiConnection() {
  const serverUrl = document.getElementById('server-url-input').value.trim() || 'http://43.130.35.117:8088'
  const apiStatus = document.getElementById('api-status')
  const testBtn = document.getElementById('test-api-btn')
  
  // 验证URL格式
  try {
    new URL(serverUrl)
  } catch (error) {
    apiStatus.textContent = '❌ 服务器URL格式不正确'
    apiStatus.className = 'api-status error'
    return
  }
  
  testBtn.disabled = true
  testBtn.textContent = '🔄 测试中...'
  apiStatus.textContent = '🔄 正在测试服务器连接...'
  apiStatus.className = 'api-status'
  
  try {
    // 测试服务器健康检查
    const response = await fetch(`${serverUrl}/api/health`)
    const data = await response.json()
    
    if (response.ok && data.success) {
      apiStatus.textContent = `✅ 服务器连接成功`
      apiStatus.className = 'api-status success'
    } else {
      apiStatus.textContent = `❌ 服务器响应异常`
      apiStatus.className = 'api-status error'
    }
  } catch (error) {
    apiStatus.textContent = `❌ 无法连接到服务器: ${error.message}`
    apiStatus.className = 'api-status error'
    console.error('服务器测试失败:', error)
  } finally {
    testBtn.disabled = false
    testBtn.textContent = '🔍 测试服务器连接'
  }
}

// 处理 AI Provider 切换
function handleProviderChange(e) {
  const provider = e.target.value
  const hint = document.getElementById('api-hint')
  const input = document.getElementById('api-key-input')
  
  if (provider === 'gemini') {
    input.placeholder = '输入你的 Gemini API Key (sk- 或 AIzaSy 开头)'
    hint.innerHTML = '获取 API Key: <a href="https://aistudio.google.com/app/apikey" target="_blank" id="api-link">aistudio.google.com</a>'
  }
}

















































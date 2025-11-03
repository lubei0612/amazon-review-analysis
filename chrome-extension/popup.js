// ========================
// Popup Script - 弹窗逻辑
// ========================

let currentProductInfo = null

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载 API 配置状态
  loadApiKeyStatus()
  
  // 刷新产品信息
  refreshProductInfo()
  
  // 绑定按钮事件
  document.getElementById('analyze-btn').addEventListener('click', startAnalysis)
  document.getElementById('refresh-btn').addEventListener('click', refreshProductInfo)
  document.getElementById('settings-toggle-btn').addEventListener('click', toggleSettings)
  document.getElementById('save-api-key-btn').addEventListener('click', saveApiKey)
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
      // 任务创建成功，打开报告页面
      const reportUrl = `http://localhost:3002/#/report/${response.taskId}`
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
// API Key 管理功能
// ========================

// 加载 API Key 状态
async function loadApiKeyStatus() {
  try {
    const result = await chrome.storage.local.get(['groqApiKey', 'aiProvider'])
    const apiKey = result.groqApiKey
    const provider = result.aiProvider || 'groq'  // 默认 groq
    
    const apiStatus = document.getElementById('api-status')
    const apiInput = document.getElementById('api-key-input')
    const providerSelect = document.getElementById('ai-provider-select')
    
    // 设置 Provider 选择器
    if (providerSelect) {
      providerSelect.value = provider
      // 触发一次 change 事件，更新提示链接
      handleProviderChange({ target: { value: provider } })
    }
    
    if (apiKey) {
      apiInput.value = apiKey
      apiStatus.textContent = `✅ 已配置 (${provider.toUpperCase()})`
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

// 保存 API Key
async function saveApiKey() {
  const apiKey = document.getElementById('api-key-input').value.trim()
  const provider = document.getElementById('ai-provider-select').value
  const apiStatus = document.getElementById('api-status')
  
  if (!apiKey) {
    apiStatus.textContent = '❌ 请输入 API Key'
    apiStatus.className = 'api-status error'
    return
  }
  
  // 基本格式验证（警告但不阻止保存）
  if (provider === 'groq' && !apiKey.startsWith('gsk_')) {
    apiStatus.textContent = '⚠️ Groq API Key 通常以 gsk_ 开头'
    apiStatus.className = 'api-status error'
    // 但仍然允许保存（可能用户使用了不同的格式）
  } else if (provider === 'gemini' && !apiKey.startsWith('sk-')) {
    apiStatus.textContent = '⚠️ Gemini API Key 通常以 sk- 开头'
    apiStatus.className = 'api-status error'
    // 但仍然允许保存
  }
  
  try {
    await chrome.storage.local.set({ 
      groqApiKey: apiKey,      // 字段名保持不变，兼容性
      aiProvider: provider     // 保存 Provider 选择
    })
    
    apiStatus.textContent = `✅ 保存成功 (${provider.toUpperCase()})`
    apiStatus.className = 'api-status success'
    
    console.log('API 配置已保存:', { provider, keyLength: apiKey.length })
    
    // 2秒后自动隐藏设置面板
    setTimeout(() => {
      document.getElementById('settings-panel').style.display = 'none'
    }, 2000)
    
  } catch (error) {
    apiStatus.textContent = '❌ 保存失败'
    apiStatus.className = 'api-status error'
    console.error('保存 API Key 失败:', error)
  }
}

// 测试 API 连接
async function testApiConnection() {
  const apiKey = document.getElementById('api-key-input').value.trim()
  const provider = document.getElementById('ai-provider-select').value
  const apiStatus = document.getElementById('api-status')
  const testBtn = document.getElementById('test-api-btn')
  
  if (!apiKey) {
    apiStatus.textContent = '❌ 请先输入 API Key'
    apiStatus.className = 'api-status error'
    return
  }
  
  testBtn.disabled = true
  testBtn.textContent = '🔄 测试中...'
  apiStatus.textContent = '🔄 正在测试连接...'
  apiStatus.className = 'api-status'
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'testApiKey',
      apiKey: apiKey,
      provider: provider  // 传递 Provider 信息
    })
    
    if (response.success) {
      apiStatus.textContent = `✅ 连接成功 (${provider.toUpperCase()})`
      apiStatus.className = 'api-status success'
    } else {
      apiStatus.textContent = `❌ 连接失败: ${response.error || '未知错误'}`
      apiStatus.className = 'api-status error'
    }
  } catch (error) {
    apiStatus.textContent = `❌ 测试失败: ${error.message}`
    apiStatus.className = 'api-status error'
    console.error('API 测试失败:', error)
  } finally {
    testBtn.disabled = false
    testBtn.textContent = '🔍 测试连接'
  }
}

// 处理 AI Provider 切换
function handleProviderChange(e) {
  const provider = e.target.value
  const hint = document.getElementById('api-hint')
  const input = document.getElementById('api-key-input')
  
  if (provider === 'gemini') {
    input.placeholder = '输入你的 Gemini API Key (以 sk- 开头)'
    hint.innerHTML = '获取 API Key: <a href="https://aihubmix.com/" target="_blank" id="api-link">aihubmix.com</a>'
  } else {
    input.placeholder = '输入你的 Groq API Key (以 gsk_ 开头)'
    hint.innerHTML = '获取 API Key: <a href="https://console.groq.com/keys" target="_blank" id="api-link">console.groq.com</a>'
  }
}

















































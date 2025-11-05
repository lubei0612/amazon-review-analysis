// ========================
// Content Script - 页面注入脚本
// ========================

console.log('Amazon评论分析助手已加载')

// 提取产品信息
function extractProductInfo() {
  const urlMatch = window.location.href.match(/\/dp\/([A-Z0-9]{10})|\/product\/([A-Z0-9]{10})/)
  const asin = urlMatch ? (urlMatch[1] || urlMatch[2]) : null
  
  if (!asin) {
    return null
  }
  
  // 提取标题
  const titleElement = document.querySelector('#productTitle, #title')
  const title = titleElement ? titleElement.textContent.trim() : '未知产品'
  
  // 提取评论数
  const reviewElement = document.querySelector('#acrCustomerReviewText, [data-hook="total-review-count"]')
  let reviewCount = 0
  if (reviewElement) {
    const match = reviewElement.textContent.match(/[\d,]+/)
    reviewCount = match ? parseInt(match[0].replace(/,/g, '')) : 0
  }
  
  // 提取评分
  const ratingElement = document.querySelector('.a-icon-star .a-icon-alt, [data-hook="rating-out-of-text"]')
  const rating = ratingElement ? parseFloat(ratingElement.textContent) : 0
  
  // 提取图片
  const imageElement = document.querySelector('#landingImage, #imgBlkFront')
  const image = imageElement ? imageElement.src : ''
  
  return {
    asin,
    title,
    reviewCount,
    rating,
    image,
    productUrl: window.location.href
  }
}

// 注入UI到产品页面
function injectUI() {
  // ✅ 1. 先检查是否是产品详情页
  const productInfo = extractProductInfo()
  if (!productInfo || !productInfo.asin) {
    console.log('不是产品详情页，跳过UI注入')
    return
  }
  
  console.log('✓ 检测到产品详情页，ASIN:', productInfo.asin)
  
  // ✅ 2. 尝试多个可能的注入位置
  let targetElement = null
  const possibleLocations = [
    { element: document.querySelector('#above-dp-container'), name: 'above-dp-container' },
    { element: document.querySelector('#centerCol'), name: 'centerCol' },
    { element: document.querySelector('#dp-container'), name: 'dp-container' },
    { element: document.querySelector('#ppd'), name: 'ppd' }
  ]
  
  for (const location of possibleLocations) {
    if (location.element) {
      targetElement = location.element
      console.log(`✓ 找到注入位置: ${location.name}`)
      break
    }
  }
  
  if (!targetElement) {
    console.warn('找不到合适的注入位置，稍后重试...')
    return
  }
  
  // ✅ 3. 检查是否已注入
  if (document.getElementById('jimao-analysis-panel')) {
    console.log('分析面板已存在')
    return
  }
  
  // ✅ 4. 创建容器
  const container = document.createElement('div')
  container.id = 'jimao-analysis-panel'
  targetElement.insertAdjacentElement('afterend', container)
  
  // 加载 UI HTML（不使用 Shadow DOM，直接嵌入）
  fetch(chrome.runtime.getURL('ui.html'))
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html
      
      // 动态加载 CSS
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = chrome.runtime.getURL('ui.css')
      document.head.appendChild(link)
      
      console.log('✓ 分析面板已注入到页面')
      
      // 初始化UI
      initUI(container)
    })
    .catch(error => {
      console.error('注入UI失败:', error)
    })
}

// 初始化UI交互
function initUI(container) {
  const productInfo = extractProductInfo()
  
  if (!productInfo) {
    console.warn('无法提取产品信息')
    return
  }
  
  // 显示产品信息
  const titleEl = container.querySelector('#product-title')
  const reviewCountEl = container.querySelector('#review-count')
  
  if (titleEl) titleEl.textContent = productInfo.title
  if (reviewCountEl) reviewCountEl.textContent = `${productInfo.reviewCount} 条评论`
  
  // 绑定按钮事件
  const analyzeBtn = container.querySelector('#analyze-btn')
  
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      startAnalysis(productInfo, container)
    })
  }
}

// 开始分析
async function startAnalysis(productInfo, container) {
  const analyzeBtn = container.querySelector('#analyze-btn')
  const statusEl = container.querySelector('#status')
  const progressEl = container.querySelector('#progress')
  const progressBarEl = container.querySelector('.progress-bar')
  
  if (analyzeBtn) analyzeBtn.disabled = true
  if (statusEl) statusEl.textContent = '正在创建分析任务...'
  if (progressEl) progressEl.style.display = 'block'
  
  try {
    // 检查扩展context是否有效
    if (!chrome.runtime?.id) {
      throw new Error('扩展已重新加载，请刷新页面后重试（按F5或Ctrl+R）')
    }
    
    // 发送消息到Background Script
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: 'startAnalysis',
        data: productInfo
      }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(`扩展通信失败: ${chrome.runtime.lastError.message}。请刷新页面后重试。`))
        } else {
          resolve(response)
        }
      })
    })
    
    if (response.success) {
      if (statusEl) statusEl.textContent = '正在抓取评论...'
      
      // 轮询任务状态
      pollTaskStatus(response.taskId, container)
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    if (statusEl) statusEl.textContent = `错误: ${error.message}`
    if (analyzeBtn) analyzeBtn.disabled = false
  }
}

// 显示分析结果
function displayAnalysisResults(result, taskId, container) {
  console.log('🎨 开始渲染UI，数据结构:', result)
  
  // ✅ 保存完整数据供模态框使用
  fullAnalysisData = result
  
  // 隐藏占位符和进度条
  const placeholder = container.querySelector('#analysis-placeholder')
  const progressSection = container.querySelector('#progress')
  const resultsContainer = container.querySelector('#analysis-results')
  
  if (placeholder) placeholder.style.display = 'none'
  if (progressSection) progressSection.style.display = 'none'
  if (resultsContainer) {
    resultsContainer.style.display = 'block'
    resultsContainer.style.visibility = 'visible'
    resultsContainer.style.opacity = '1'
  }
  
  // 填充6大模块数据
  if (result) {
    console.log('✅ 开始填充模块数据...')
    
    // 消费者画像
    if (result.consumerProfile) {
      console.log('📊 渲染消费者画像:', result.consumerProfile)
      renderConsumerProfile(result.consumerProfile, container)
    } else {
      console.warn('⚠️ 缺少 consumerProfile 数据')
    }
    
    // 使用场景
    if (result.usageScenarios) {
      console.log('📊 渲染使用场景:', result.usageScenarios)
      renderTableModule('usage-scenarios-content', result.usageScenarios, container, true, 'scenario')  // ✅ 添加进度条
    } else {
      console.warn('⚠️ 缺少 usageScenarios 数据')
    }
    
    // 未被满足的需求 (添加进度条)
    if (result.unmetNeeds) {
      console.log('📊 渲染未满足需求:', result.unmetNeeds)
      renderTableModule('unmet-needs-content', result.unmetNeeds, container, true, 'unmet')
    } else {
      console.warn('⚠️ 缺少 unmetNeeds 数据')
    }
    
    // 好评（使用 strengths 而不是 positive）
    if (result.productExperience?.strengths) {
      console.log('📊 渲染好评:', result.productExperience.strengths)
      renderTableModule('positive-content', result.productExperience.strengths, container, true, 'positive')
    } else {
      console.warn('⚠️ 缺少 productExperience.strengths 数据')
    }
    
    // 差评（使用 weaknesses 而不是 negative）
    if (result.productExperience?.weaknesses) {
      console.log('📊 渲染差评:', result.productExperience.weaknesses)
      renderTableModule('negative-content', result.productExperience.weaknesses, container, true, 'negative')
    } else {
      console.warn('⚠️ 缺少 productExperience.weaknesses 数据')
    }
    
    // 购买动机 (添加进度条)
    if (result.purchaseMotivation) {
      console.log('📊 渲染购买动机:', result.purchaseMotivation)
      renderTableModule('purchase-motivation-content', result.purchaseMotivation, container, true, 'motivation')
    } else {
      console.warn('⚠️ 缺少 purchaseMotivation 数据')
    }
    
    console.log('✅ UI渲染完成！')
  } else {
    console.error('❌ result 为空，无法渲染UI')
  }
  
  // ✅ 初始化放大按钮事件
  initExpandButtons(container)
  console.log('🔍 放大按钮事件已初始化')
  
  // 修改底部按钮为"查看完整报告"
  const analyzeBtn = container.querySelector('#analyze-btn')
  const footerNote = container.querySelector('.footer-note')
  
  if (analyzeBtn) {
    analyzeBtn.textContent = '📊 查看完整报告 →'
    analyzeBtn.disabled = false
    analyzeBtn.onclick = () => {
      const reportUrl = `http://localhost:3002/#/report/${taskId}`
      window.open(reportUrl, '_blank')
    }
  }
  
  if (footerNote) {
    footerNote.textContent = '当前分析结论取自 Top Reviews，点击右侧按钮查看完整报告'
  }
}

// 渲染消费者画像模块
function renderConsumerProfile(data, container) {
  console.log('🎨 renderConsumerProfile 被调用')
  console.log('📋 完整数据:', JSON.stringify(data).substring(0, 500))
  console.log('📋 数据keys:', Object.keys(data || {}))
  
  const contentEl = container.querySelector('#consumer-profile-content')
  if (!contentEl) {
    console.error('❌ 找不到 #consumer-profile-content 元素')
    return
  }
  if (!data) {
    console.error('❌ consumerProfile 数据为空')
    contentEl.innerHTML = '<div style="padding:10px;color:#999;">暂无消费者画像数据</div>'
    return
  }
  
  let html = ''
  
  // ✅ 兼容新旧数据结构
  // 性别占比（如果有数据）
  const genderData = data.genderRatio || data.gender // 新结构用genderRatio，旧结构用gender
  console.log('👥 genderData:', genderData)
  
  if (genderData) {
    const malePercent = genderData.male || 0
    const femalePercent = genderData.female || 0
    
    html += `
      <div class="gender-section">
        <div class="gender-item">
          <span>
            <svg class="gender-icon-svg" viewBox="0 0 24 24" fill="url(#maleGradient)">
              <defs>
                <linearGradient id="maleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style="stop-color:#2563EB;stop-opacity:1" />
                  <stop offset="${malePercent}%" style="stop-color:#2563EB;stop-opacity:1" />
                  <stop offset="${malePercent}%" style="stop-color:#DBEAFE;stop-opacity:0.25" />
                  <stop offset="100%" style="stop-color:#DBEAFE;stop-opacity:0.25" />
                </linearGradient>
              </defs>
              <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm12-5v4h-2v-2.6l-3.2 3.2c1.1 1.2 1.7 2.8 1.7 4.4 0 3.9-3.1 7-7 7s-7-3.1-7-7 3.1-7 7-7c1.3 0 2.5.3 3.6.9L16.4 4H14V2h5c.6 0 1 .4 1 1z"/>
            </svg>
          </span>
          <span>${malePercent}%</span>
        </div>
        <div class="gender-item">
          <span>
            <svg class="gender-icon-svg" viewBox="0 0 24 24" fill="url(#femaleGradient)">
              <defs>
                <linearGradient id="femaleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style="stop-color:#DB2777;stop-opacity:1" />
                  <stop offset="${femalePercent}%" style="stop-color:#DB2777;stop-opacity:1" />
                  <stop offset="${femalePercent}%" style="stop-color:#FCE7F3;stop-opacity:0.25" />
                  <stop offset="100%" style="stop-color:#FCE7F3;stop-opacity:0.25" />
                </linearGradient>
              </defs>
              <path d="M17.5 9.5C17.5 6.5 15 4 12 4S6.5 6.5 6.5 9.5c0 2.7 2 5 4.5 5.4V17H9v2h2v2h2v-2h2v-2h-2v-2.1c2.5-.4 4.5-2.7 4.5-5.4zM12 13c-1.9 0-3.5-1.6-3.5-3.5S10.1 6 12 6s3.5 1.6 3.5 3.5S13.9 13 12 13z"/>
            </svg>
          </span>
          <span>${femalePercent}%</span>
        </div>
      </div>
    `
  }
  
  // ✅ 4维度数据（兼容新旧结构）
  // 新结构：demographics, usageTime, usageLocation, behaviors
  // 旧结构：dimensions { personas, moments, locations, behaviors }
  
  console.log('📋 检查dimensions字段:', {
    hasDimensions: !!data.dimensions,
    hasDemographics: !!data.demographics,
    hasUsageTime: !!data.usageTime,
    hasUsageLocation: !!data.usageLocation,
    hasBehaviors: !!data.behaviors
  })
  
  const hasDimensions = data.dimensions || (data.demographics && data.usageTime && data.usageLocation && data.behaviors)
  
  if (hasDimensions) {
    html += `<div class="dimensions-table">`
    
    // 映射新旧字段名
    const dimensionMap = data.dimensions ? {
      personas: { title: '人群特征', data: data.dimensions.personas || [] },
      moments: { title: '使用时刻', data: data.dimensions.moments || [] },
      locations: { title: '使用地点', data: data.dimensions.locations || [] },
      behaviors: { title: '行为', data: data.dimensions.behaviors || [] }
    } : {
      personas: { title: '人群特征', data: data.demographics || [] },
      moments: { title: '使用时刻', data: data.usageTime || [] },
      locations: { title: '使用地点', data: data.usageLocation || [] },
      behaviors: { title: '行为', data: data.behaviors || [] }
    }
    
    console.log('📋 dimensionMap:', Object.keys(dimensionMap).map(k => `${k}: ${dimensionMap[k].data.length}条`))
    
    for (const [key, config] of Object.entries(dimensionMap)) {
      let items = config.data
      
      // ✅ 填充到3行
      while (items.length < 3) {
        items.push({ desc: '--', description: '--', percentage: '--', percent: '--', persona: '--', occasion: '--', place: '--', behavior: '--' })
      }
      
      html += `
        <div class="dimension-column">
          <div class="dimension-header">${config.title}</div>
          ${items.slice(0, 3).map(item => {
            // 兼容多种字段名
            const desc = item.persona || item.occasion || item.place || item.behavior || item.desc || item.description || '--'
            const percent = item.percent || item.percentage || '--'
            return `<div class="dimension-item">${desc} (${percent}${percent !== '--' ? '%' : ''})</div>`
          }).join('')}
        </div>
      `
    }
    
    html += `</div>`
  } else {
    console.warn('⚠️ 没有找到dimensions数据')
    html += '<div style="padding:10px;color:#999;">暂无维度数据</div>'
  }
  
  if (html.length === 0) {
    html = '<div style="padding:10px;color:#999;">消费者画像数据格式异常</div>'
  }
  
  contentEl.innerHTML = html
  console.log('✅ 消费者画像HTML已设置，长度:', html.length)
}

// 渲染表格模块（使用场景、未被满足的需求、好评、差评、购买动机）
function renderTableModule(contentId, data, container, showProgressBar = false, type = null) {
  console.log(`🎨 renderTableModule 被调用: ${contentId}，数据:`, data)
  const contentEl = container.querySelector(`#${contentId}`)
  if (!contentEl) {
    console.error(`❌ 找不到 #${contentId} 元素`)
    return
  }
  
  // ✅ 即使数据为空也要显示表格
  const items = Array.isArray(data) ? data : (data?.items || [])
  let displayItems = items.slice(0, 5)
  
  // ✅ 填充到5行（不足用"--"填充）
  while (displayItems.length < 5) {
    displayItems.push({
      aspect: '--',
      desc: '--',
      description: '--',
      name: '--',
      need: '--',
      type: '--',
      percentage: '--',
      percent: '--',
      reason: '--'
    })
  }
  
  console.log(`📊 ${contentId} 数据项数:`, items.length, '显示项数:', displayItems.length)
  
  // 添加展开按钮（如果有更多数据）
  const hasMore = items.length > 5
  const expandBtnId = `expand-btn-${contentId.replace(/-/g, '_')}`
  
  let html = hasMore ? `
    <div style="text-align:right;margin-bottom:8px;">
      <button 
        id="${expandBtnId}"
        style="background:#3B82F6;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;box-shadow:0 2px 4px rgba(0,0,0,0.1);"
        onmouseover="this.style.background='#2563EB';this.style.transform='translateY(-1px)'" 
        onmouseout="this.style.background='#3B82F6';this.style.transform='translateY(0)'">
        📋 查看全部 (${items.length}条)
      </button>
    </div>
  ` : ''
  
  html += `
    <table class="analysis-table">
      <thead>
        <tr>
          <th>描述</th>
          <th>占比</th>
          <th>原因</th>
        </tr>
      </thead>
      <tbody>
  `
  
  displayItems.forEach(item => {
    const percent = item.percent || item.percentage || '--'
    const percentValue = percent !== '--' ? parseInt(percent) : 0
    
    html += `<tr>`
    
    // 描述列（针对不同模块使用不同字段，截断长度改为10字符）
    let description = '--'
    if (contentId === 'purchase-motivation-content') {
      description = item.type || '--'  // 购买动机显示type
    } else if (contentId === 'usage-scenarios-content') {
      description = item.name || item.description || '--'  // 使用场景显示name
    } else if (contentId === 'unmet-needs-content') {
      description = item.need || item.description || '--'  // 未满足需求显示need
    } else {
      description = item.aspect || item.desc || '--'  // 好评/差评显示aspect
    }
    html += `<td class="desc-col">${truncateText(description, 10)}</td>`
    
    // 占比列（所有模块都显示进度条）
    const showBar = (type === 'positive' || type === 'negative' || type === 'unmet' || type === 'motivation' || type === 'scenario')
    
    if (percent !== '--') {
      if (showBar) {
        // 根据类型选择进度条颜色 - 直接用inline style确保显示
        let bgColor = 'linear-gradient(90deg, #3B82F6, #60A5FA)'  // 默认蓝色
        if (type === 'positive') {
          bgColor = 'linear-gradient(90deg, #10B981, #34D399)'  // 绿色
        } else if (type === 'negative' || type === 'unmet') {
          bgColor = 'linear-gradient(90deg, #EF4444, #F87171)'  // 红色
        } else if (type === 'motivation' || type === 'scenario') {
          bgColor = 'linear-gradient(90deg, #3B82F6, #60A5FA)'  // 蓝色
        }
        
        // ✅ 调试日志
        console.log(`📊 进度条生成: ${contentId}, percent=${percent}%, percentValue=${percentValue}%, type=${type}, bgColor=${bgColor}`)
        
        html += `
          <td class="percent-col">
            <div class="percent-with-bar">
              <span class="percent-text" style="font-weight:600;color:#1F2937;">${percent}%</span>
              <div class="progress-bar-container" style="width:100%;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;margin-top:4px;position:relative;">
                <div style="position:absolute;left:0;top:0;height:100%;width:${percentValue}%;background:${bgColor};border-radius:3px;transition:width 0.3s ease;z-index:1;"></div>
              </div>
            </div>
          </td>
        `
      } else {
        // 其他模块只显示百分比文字
        html += `<td class="percent-col"><span class="percent-text">${percent}%</span></td>`
      }
    } else {
      html += `<td class="percent-col"><span class="percent-text">--</span></td>`
    }
    
    // 原因列（使用CSS省略，不做JS截断）
    const fullReason = item.reason || item.reasons || '--'
    html += `<td class="reason-col">${fullReason}</td>`
    
    html += `</tr>`
  })
  
  html += `
      </tbody>
    </table>
  `
  
  contentEl.innerHTML = html
  console.log(`✅ ${contentId} HTML已设置，长度:`, html.length)
  
  // 添加展开按钮点击事件
  if (hasMore) {
    const expandBtn = document.getElementById(expandBtnId)
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        showFullDataModal(contentId, items, type)
      })
    }
  }
}

// 显示完整数据的模态窗口
function showFullDataModal(contentId, items, type) {
  // 创建模态窗口
  const modal = document.createElement('div')
  modal.id = `modal-${contentId}`
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `
  
  // 获取模块标题
  const titles = {
    'usage-scenarios-content': '使用场景',
    'unmet-needs-content': '未被满足的需求',
    'positive-content': '好评',
    'negative-content': '差评',
    'purchase-motivation-content': '购买动机'
  }
  const title = titles[contentId] || '详细信息'
  
  // 构建表格HTML
  let tableHtml = `
    <div style="background:white;border-radius:12px;max-width:900px;max-height:80vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:slideUp 0.3s ease;">
      <div style="padding:20px;border-bottom:2px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:white;z-index:1;">
        <h2 style="margin:0;color:#1F2937;font-size:20px;">📊 ${title} - 完整数据 (${items.length}条)</h2>
        <button id="close-modal-${contentId}" style="background:#EF4444;color:white;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;line-height:32px;padding:0;" onmouseover="this.style.background='#DC2626'" onmouseout="this.style.background='#EF4444'">×</button>
      </div>
      <div style="padding:20px;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#F3F4F6;">
              <th style="padding:12px;text-align:left;border:1px solid #E5E7EB;font-weight:600;color:#374151;">序号</th>
              <th style="padding:12px;text-align:left;border:1px solid #E5E7EB;font-weight:600;color:#374151;">描述</th>
              <th style="padding:12px;text-align:left;border:1px solid #E5E7EB;font-weight:600;color:#374151;">占比</th>
              <th style="padding:12px;text-align:left;border:1px solid #E5E7EB;font-weight:600;color:#374151;">原因</th>
            </tr>
          </thead>
          <tbody>
  `
  
  items.forEach((item, index) => {
    const percent = item.percent || item.percentage || '--'
    const percentValue = percent !== '--' ? parseInt(percent) : 0
    let description = '--'
    if (contentId === 'purchase-motivation-content') {
      description = item.type || '--'
    } else if (contentId === 'usage-scenarios-content') {
      description = item.name || item.description || '--'
    } else if (contentId === 'unmet-needs-content') {
      description = item.need || item.description || '--'
    } else {
      description = item.aspect || item.desc || '--'
    }
    const reason = item.reason || '--'
    
    // 根据类型选择进度条颜色
    let bgColor = 'linear-gradient(90deg, #3B82F6, #60A5FA)'  // 默认蓝色
    if (type === 'positive') {
      bgColor = 'linear-gradient(90deg, #10B981, #34D399)'  // 绿色
    } else if (type === 'negative' || type === 'unmet') {
      bgColor = 'linear-gradient(90deg, #EF4444, #F87171)'  // 红色
    }
    
    tableHtml += `
      <tr style="border-bottom:1px solid #E5E7EB;${index % 2 === 0 ? 'background:#F9FAFB;' : 'background:white;'}">
        <td style="padding:12px;border:1px solid #E5E7EB;font-weight:500;color:#6B7280;">${index + 1}</td>
        <td style="padding:12px;border:1px solid #E5E7EB;color:#1F2937;">${description}</td>
        <td style="padding:12px;border:1px solid #E5E7EB;">
          <div>
            <div style="font-weight:600;color:#1F2937;margin-bottom:4px;">${percent}${percent !== '--' ? '%' : ''}</div>
            ${percent !== '--' ? `
              <div style="width:100%;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${percentValue}%;background:${bgColor};border-radius:3px;"></div>
              </div>
            ` : ''}
          </div>
        </td>
        <td style="padding:12px;border:1px solid #E5E7EB;color:#6B7280;line-height:1.6;">${reason}</td>
      </tr>
    `
  })
  
  tableHtml += `
          </tbody>
        </table>
      </div>
    </div>
  `
  
  modal.innerHTML = tableHtml
  document.body.appendChild(modal)
  
  // 添加关闭按钮事件
  const closeBtn = document.getElementById(`close-modal-${contentId}`)
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.remove()
    })
  }
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
  
  // ESC键关闭
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      modal.remove()
      document.removeEventListener('keydown', escHandler)
    }
  }
  document.addEventListener('keydown', escHandler)
}

// 文本截断工具
function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 轮询任务状态
async function pollTaskStatus(taskId, container) {
  const statusEl = container.querySelector('#status')
  const progressBarEl = container.querySelector('.progress-bar')
  const analyzeBtn = container.querySelector('#analyze-btn')
  
  const interval = setInterval(async () => {
    // 检查扩展context是否有效
    if (!chrome.runtime?.id) {
      clearInterval(interval)
      if (statusEl) statusEl.textContent = '扩展已重新加载，请刷新页面'
      console.error('Extension context invalidated. Please refresh the page.')
      return
    }
    
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        action: 'checkTaskStatus',
        taskId
      }, (response) => {
        if (chrome.runtime.lastError) {
          clearInterval(interval)
          reject(new Error(`扩展通信失败: ${chrome.runtime.lastError.message}`))
        } else {
          resolve(response)
        }
      })
    }).catch(error => {
      clearInterval(interval)
      if (statusEl) statusEl.textContent = '通信错误，请刷新页面'
      console.error('Poll error:', error)
      return null
    })
    
    if (!response) return
    
    if (response.success) {
      const { status, progress, result } = response
      
      // 更新进度条 - 使用完整inline style（不依赖CSS）
      if (progressBarEl) {
        const progressValue = Math.round(progress || 0)
        
        // ✅ 完整的inline style设置，确保从左到右填充
        progressBarEl.style.position = 'absolute'
        progressBarEl.style.left = '0'
        progressBarEl.style.top = '0'
        progressBarEl.style.width = `${progressValue}%`
        progressBarEl.style.height = '100%'
        progressBarEl.style.background = 'linear-gradient(90deg, #10B981, #34D399)'
        progressBarEl.style.borderRadius = '3px'
        progressBarEl.style.transition = 'width 0.3s ease'
        progressBarEl.style.zIndex = '1'
        
        console.log(`📊 进度更新: ${progressValue}%, status: ${status}, width已设置`)
      }
      
      // 更新状态文字
      const progressValue = Math.round(progress || 0)
      const statusText = {
        'pending': '等待中...',
        'scraping': `正在抓取评论 ${progressValue}%`,
        'analyzing': `AI分析中 ${progressValue}%`,
        'completed': '分析完成！',
        'failed': '分析失败'
      }
      
      if (statusEl) {
        statusEl.textContent = statusText[status] || status
      }
      
      // 任务完成
      if (status === 'completed') {
        clearInterval(interval)
        
        console.log('🎉 任务完成！原始 result:', result)
        console.log('📦 result.analysis:', result.analysis)
        console.log('📦 result 本身:', result)
        
        // 显示分析结果（注入到页面）
        // ✅ 优先使用 result.analysis，如果不存在则使用 result 本身
        const analysisData = result.analysis || result
        console.log('🚀 准备渲染，最终数据:', analysisData)
        
        displayAnalysisResults(analysisData, taskId, container)
      }
      
      // 任务失败
      if (status === 'failed') {
        clearInterval(interval)
        if (analyzeBtn) analyzeBtn.disabled = false
        if (statusEl) statusEl.textContent = '分析失败，请重试'
      }
    }
  }, 2000)
}

// 监听来自Popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProductInfo') {
    const info = extractProductInfo()
    sendResponse({ success: true, data: info })
    return true  // 保持消息通道打开
  }
  
  if (request.action === 'injectUI') {
    injectUI()
    sendResponse({ success: true })
    return true  // 保持消息通道打开
  }
})

// ========================
// 模态框功能
// ========================

// 存储完整数据
let fullAnalysisData = null

// 打开模态框显示完整维度数据
function openDimensionModal(moduleName, moduleTitle) {
  console.log('🔍 [DEBUG] 点击放大按钮:', { moduleName, moduleTitle })
  
  const modal = document.querySelector('#dimension-modal')
  const modalTitle = document.querySelector('#modal-title')
  const modalBody = document.querySelector('#modal-body')
  
  console.log('🔍 [DEBUG] 检查元素:')
  console.log('  - modal:', modal ? '✅ 存在' : '❌ 不存在')
  console.log('  - modalTitle:', modalTitle ? '✅ 存在' : '❌ 不存在')
  console.log('  - modalBody:', modalBody ? '✅ 存在' : '❌ 不存在')
  console.log('  - fullAnalysisData:', fullAnalysisData ? '✅ 存在' : '❌ null')
  
  if (fullAnalysisData) {
    console.log('🔍 [DEBUG] fullAnalysisData keys:', Object.keys(fullAnalysisData))
  }
  
  if (!modal || !modalTitle || !modalBody || !fullAnalysisData) {
    console.error('❌ 模态框元素或数据不存在')
    console.error('详细信息:', {
      modal: !!modal,
      modalTitle: !!modalTitle,
      modalBody: !!modalBody,
      fullAnalysisData: !!fullAnalysisData
    })
    
    // 如果数据不存在，给用户友好的提示
    if (!fullAnalysisData) {
      alert('请先完成分析后再查看详情')
    }
    return
  }
  
  console.log('✅ [DEBUG] 所有元素和数据都存在，准备显示模态框')
  
  // 设置标题
  modalTitle.textContent = moduleTitle
  
  // 根据模块类型渲染内容
  let content = ''
  
  if (moduleName === 'consumer-profile') {
    // 消费者画像 - 完整显示
    const data = fullAnalysisData.consumerProfile
    if (data) {
      content = renderConsumerProfileModal(data)
    }
  } else if (moduleName === 'usage-scenarios') {
    // 使用场景 - 完整表格
    const data = fullAnalysisData.usageScenarios
    if (data) {
      content = renderTableModal(data, 'scenario')
    }
  } else if (moduleName === 'unmet-needs') {
    // 未满足需求 - 完整表格
    const data = fullAnalysisData.unmetNeeds
    if (data) {
      content = renderTableModal(data, 'unmet')
    }
  } else if (moduleName === 'positive') {
    // 好评 - 完整表格
    const data = fullAnalysisData.productExperience?.strengths
    if (data) {
      content = renderTableModal(data, 'positive')
    }
  } else if (moduleName === 'negative') {
    // 差评 - 完整表格
    const data = fullAnalysisData.productExperience?.weaknesses
    if (data) {
      content = renderTableModal(data, 'negative')
    }
  } else if (moduleName === 'purchase-motivation') {
    // 购买动机 - 完整表格
    const data = fullAnalysisData.purchaseMotivation
    if (data) {
      content = renderTableModal(data, 'motivation')
    }
  }
  
  modalBody.innerHTML = content || '<p style="text-align:center;color:#999;">暂无数据</p>'
  
  console.log('✅ [DEBUG] 模态框内容已设置，长度:', content ? content.length : 0)
  
  // 显示模态框
  modal.style.display = 'flex'
  console.log('✅ [DEBUG] 模态框已显示 (display = flex)')
  
  // 添加关闭事件
  setupModalCloseEvents(modal)
  console.log('✅ [DEBUG] 关闭事件已设置')
}

// 渲染消费者画像模态框内容
function renderConsumerProfileModal(data) {
  let html = ''
  
  // 性别比例
  const genderData = data.genderRatio || data.gender
  if (genderData) {
    const malePercent = genderData.male || 0
    const femalePercent = genderData.female || 0
    const unknownPercent = genderData.unknown || 0
    
    html += `
      <div class="gender-section">
        <div class="gender-item">
          <svg class="gender-icon-svg" viewBox="0 0 24 24" fill="url(#maleGradient)">
            <defs>
              <linearGradient id="maleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#2563EB;stop-opacity:1" />
                <stop offset="${malePercent}%" style="stop-color:#2563EB;stop-opacity:1" />
                <stop offset="${malePercent}%" style="stop-color:#DBEAFE;stop-opacity:0.25" />
                <stop offset="100%" style="stop-color:#DBEAFE;stop-opacity:0.25" />
              </linearGradient>
            </defs>
            <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm12-5v4h-2v-2.6l-3.2 3.2c1.1 1.2 1.7 2.8 1.7 4.4 0 3.9-3.1 7-7 7s-7-3.1-7-7 3.1-7 7-7c1.3 0 2.5.3 3.6.9L16.4 4H14V2h5c.6 0 1 .4 1 1z"/>
          </svg>
          <span style="font-size:24px;font-weight:600;color:#2563EB;">${malePercent}%</span>
          <span style="font-size:12px;color:#6B7280;">男性</span>
        </div>
        <div class="gender-item">
          <svg class="gender-icon-svg" viewBox="0 0 24 24" fill="url(#femaleGradient)">
            <defs>
              <linearGradient id="femaleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#DB2777;stop-opacity:1" />
                <stop offset="${femalePercent}%" style="stop-color:#DB2777;stop-opacity:1" />
                <stop offset="${femalePercent}%" style="stop-color:#FCE7F3;stop-opacity:0.25" />
                <stop offset="100%" style="stop-color:#FCE7F3;stop-opacity:0.25" />
              </linearGradient>
            </defs>
            <path d="M17.5 9.5C17.5 6.5 15 4 12 4S6.5 6.5 6.5 9.5c0 2.7 2 5 4.5 5.4V17H9v2h2v2h2v-2h2v-2h-2v-2.1c2.5-.4 4.5-2.7 4.5-5.4zM12 13c-1.9 0-3.5-1.6-3.5-3.5S10.1 6 12 6s3.5 1.6 3.5 3.5S13.9 13 12 13z"/>
          </svg>
          <span style="font-size:24px;font-weight:600;color:#DB2777;">${femalePercent}%</span>
          <span style="font-size:12px;color:#6B7280;">女性</span>
        </div>
        <div class="gender-item">
          <div style="width:60px;height:60px;background:#E5E7EB;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;">❓</div>
          <span style="font-size:24px;font-weight:600;color:#6B7280;">${unknownPercent}%</span>
          <span style="font-size:12px;color:#6B7280;">未知</span>
        </div>
      </div>
    `
  }
  
  // 4个维度 - 完整显示（不限制为3条）
  const dimensionMap = data.dimensions ? {
    personas: { title: '人群特征', data: data.dimensions.personas || [] },
    moments: { title: '使用时刻', data: data.dimensions.moments || [] },
    locations: { title: '使用地点', data: data.dimensions.locations || [] },
    behaviors: { title: '行为', data: data.dimensions.behaviors || [] }
  } : {
    personas: { title: '人群特征', data: data.demographics || [] },
    moments: { title: '使用时刻', data: data.usageTime || [] },
    locations: { title: '使用地点', data: data.usageLocation || [] },
    behaviors: { title: '行为', data: data.behaviors || [] }
  }
  
  html += `<div class="dimensions-table">`
  
  for (const [key, config] of Object.entries(dimensionMap)) {
    const items = config.data
    
    html += `
      <div class="dimension-column">
        <div class="dimension-header">${config.title}</div>
        ${items.map(item => {
          const desc = item.persona || item.occasion || item.place || item.behavior || item.desc || item.description || '--'
          const percent = item.percent || item.percentage || '--'
          const reason = item.reason || '--'
          return `
            <div class="dimension-item">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="font-weight:600;">${desc}</span>
                <span style="color:#3B82F6;font-weight:600;">${percent}${percent !== '--' ? '%' : ''}</span>
              </div>
              <div style="font-size:12px;color:#6B7280;line-height:1.5;">${reason}</div>
            </div>
          `
        }).join('')}
      </div>
    `
  }
  
  html += `</div>`
  
  return html
}

// 渲染表格模态框内容（使用场景、好评、差评等）
function renderTableModal(data, type) {
  const items = Array.isArray(data) ? data : (data?.items || [])
  
  if (items.length === 0) {
    return '<p style="text-align:center;color:#999;">暂无数据</p>'
  }
  
  // 根据类型选择进度条颜色
  let bgColor = 'linear-gradient(90deg, #3B82F6, #60A5FA)'
  if (type === 'positive') {
    bgColor = 'linear-gradient(90deg, #10B981, #34D399)'
  } else if (type === 'negative' || type === 'unmet') {
    bgColor = 'linear-gradient(90deg, #EF4444, #F87171)'
  } else if (type === 'motivation' || type === 'scenario') {
    bgColor = 'linear-gradient(90deg, #3B82F6, #60A5FA)'
  }
  
  let html = `
    <table class="analysis-table">
      <thead>
        <tr>
          <th>序号</th>
          <th>描述</th>
          <th>占比</th>
          <th>原因</th>
        </tr>
      </thead>
      <tbody>
  `
  
  items.forEach((item, index) => {
    let description = '--'
    if (type === 'motivation') {
      description = item.type || '--'
    } else if (type === 'scenario') {
      description = item.name || item.description || '--'
    } else if (type === 'unmet') {
      description = item.need || item.description || '--'
    } else {
      description = item.aspect || item.desc || '--'
    }
    
    const percent = item.percent || item.percentage || '--'
    const percentValue = percent !== '--' ? parseInt(percent) : 0
    const reason = item.reason || item.reasons || '--'
    
    html += `
      <tr>
        <td style="width:60px;text-align:center;font-weight:600;color:#6B7280;">${index + 1}</td>
        <td class="desc-col">${description}</td>
        <td class="percent-col">
          <div class="percent-with-bar">
            <span class="percent-text" style="font-weight:600;color:#1F2937;">${percent}%</span>
            <div class="progress-bar-container" style="width:100%;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;margin-top:4px;position:relative;">
              <div style="position:absolute;left:0;top:0;height:100%;width:${percentValue}%;background:${bgColor};border-radius:3px;transition:width 0.3s ease;z-index:1;"></div>
            </div>
          </div>
        </td>
        <td class="reason-col">${reason}</td>
      </tr>
    `
  })
  
  html += `
      </tbody>
    </table>
  `
  
  return html
}

// 设置模态框关闭事件
function setupModalCloseEvents(modal) {
  const closeBtn = modal.querySelector('#close-modal')
  const overlay = modal.querySelector('.modal-overlay')
  
  // 点击关闭按钮
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = 'none'
    }
  }
  
  // 点击遮罩层
  if (overlay) {
    overlay.onclick = () => {
      modal.style.display = 'none'
    }
  }
  
  // ESC键关闭
  const escHandler = (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none'
      document.removeEventListener('keydown', escHandler)
    }
  }
  document.addEventListener('keydown', escHandler)
}

// 初始化放大按钮事件
function initExpandButtons(container) {
  const expandBtns = container.querySelectorAll('.expand-btn')
  
  expandBtns.forEach(btn => {
    btn.onclick = () => {
      const moduleName = btn.getAttribute('data-module')
      const moduleTitle = btn.closest('.module-header').querySelector('.module-title').textContent
      
      console.log(`📋 打开模态框: ${moduleName} - ${moduleTitle}`)
      openDimensionModal(moduleName, moduleTitle)
    }
  })
}

// ========================
// 页面初始化
// ========================

// 页面加载完成后自动注入UI
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectUI, 1000)
  })
} else {
  setTimeout(injectUI, 1000)
}














































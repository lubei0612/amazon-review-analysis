<template>
  <div class="report-detail-page">
    <!-- 左侧导航栏 - 可收缩 -->
    <div 
      class="sidebar-nav" 
      :class="{ 'is-collapsed': !sidebarExpanded }"
      @mouseenter="sidebarExpanded = true"
      @mouseleave="sidebarExpanded = false"
    >
      <div class="sidebar-content">
        <div class="sidebar-header">
          <router-link to="/" class="nav-item">
            <el-icon class="nav-icon"><HomeFilled /></el-icon>
            <span class="nav-text">首页</span>
          </router-link>
        </div>

        <!-- 账号功能 - 底部 -->
        <div class="sidebar-footer">
          <div class="account-section" @click="handleAccountClick">
            <el-icon class="nav-icon"><User /></el-icon>
            <span class="nav-text">账号</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容包装器 -->
    <div class="main-wrapper" :class="{ 'sidebar-collapsed': !sidebarExpanded }">
      <!-- 页面头部 - 简约风格 -->
      <div class="page-header">
        <div class="container">
          <div class="header-content">
            <div class="brand">
              <span class="brand-icon">📊</span>
              <span class="brand-text">智能评论分析</span>
              <span class="brand-provider">即贸 Shulex VOC 提供技术</span>
            </div>
          </div>
          <div class="product-header">
            <!-- ✅ 产品图片和信息并排显示 -->
            <div class="product-header-main">
              <img 
                v-if="productData.productImage" 
                :src="productData.productImage" 
                :alt="productData.productName"
                class="product-main-image"
              />
              <div class="product-info">
                <h1 class="product-title">{{ productData.productNameCn }}</h1>
                <div class="product-meta">
                  <span class="product-subtitle">{{ productData.productName }}</span>
                  <span class="divider">|</span>
                  <span class="asin-text">ASIN: {{ productData.asin }}</span>
                  <span class="divider">|</span>
                  <span class="review-count">{{ productData.reviewCount }} 条评论</span>
                  <span v-if="productData.analyzedAt" class="divider">|</span>
                  <span v-if="productData.analyzedAt" class="analyzed-time">分析于: {{ formatDate(productData.analyzedAt) }}</span>
                </div>
                <!-- ✅ 下载报告按钮 -->
                <div class="report-actions">
                  <el-button type="primary" size="default" @click="downloadReport">
                    <el-icon><Download /></el-icon>
                    下载完整报告
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模块导航（吸顶效果） -->
      <div class="module-nav" :class="{ 'is-fixed': navFixed }">
        <div class="container">
          <div class="nav-items">
            <a
              v-for="item in navItems"
              :key="item.id"
              :href="`#${item.id}`"
              :class="{ active: activeModule === item.id }"
              @click.prevent="scrollToModule(item.id)"
            >
              {{ item.title }}
            </a>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="page-content">
        <div class="container">
          <!-- 6个模块 -->
          <div id="consumer-profile" class="module-section">
            <ConsumerProfile
              :data="productData.consumerProfile"
              :product-name="productData.productNameCn"
              :all-reviews="productData.reviews || []"
            />
          </div>

          <div id="usage-scenarios" class="module-section">
            <UsageScenarios
              :data="productData.usageScenarios"
              :product-name="productData.productNameCn"
              :all-reviews="productData.reviews || []"
            />
          </div>

          <div id="star-rating" class="module-section">
            <StarRatingImpact
              :data="productData.starRatingImpact"
              :product-name="productData.productNameCn"
            />
          </div>

          <div id="product-experience" class="module-section">
            <ProductExperience
              :negative-data="productData.productExperience.negative"
              :positive-data="productData.productExperience.positive"
              :product-name="productData.productNameCn"
            />
          </div>

          <div id="purchase-motivation" class="module-section">
            <PurchaseMotivation
              :data="productData.purchaseMotivation"
              :product-name="productData.productNameCn"
            />
          </div>

          <div id="unmet-needs" class="module-section">
            <UnmetNeeds
              :data="productData.unmetNeeds"
              :product-name="productData.productNameCn"
            />
          </div>

          <!-- ✅ 竞品分析模块 -->
          <div id="competitor-analysis" class="module-section">
            <CompetitorAnalysis
              :current-product="currentProductForComparison"
              :competitors="competitorsData"
              @add-competitor="handleAddCompetitor"
              @remove-competitor="handleRemoveCompetitor"
            />
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <div class="page-footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-info">
              <p>© 2025 即贸提供AI支持 - Amazon评论分析工具</p>
              <p class="disclaimer">本报告由AI分析生成，仅供参考</p>
            </div>
            <div class="footer-links">
              <a href="#">关于我们</a>
              <a href="#">使用指南</a>
              <a href="#">联系我们</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, User, Download } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ConsumerProfile from '@/components/ConsumerProfile.vue'
import UsageScenarios from '@/components/UsageScenarios.vue'
import StarRatingImpact from '@/components/StarRatingImpact.vue'
import ProductExperience from '@/components/ProductExperience.vue'
import PurchaseMotivation from '@/components/PurchaseMotivation.vue'
import UnmetNeeds from '@/components/UnmetNeeds.vue'
import CompetitorAnalysis from '@/components/CompetitorAnalysis.vue'

// Mock数据导入
import earbudsData from '@/mock/earbuds-data.js'
import appleSlicerData from '@/mock/apple-slicer-data.js'
import laptopBackpackData from '@/mock/laptop-backpack-data.js'

const route = useRoute()
const productData = ref(earbudsData)
const navFixed = ref(false)
const activeModule = ref('consumer-profile')
const navOffsetTop = ref(0)
const sidebarExpanded = ref(false) // 侧边栏展开状态

// ✅ 竞品数据
const competitorsData = ref([])

// ✅ 当前产品用于竞品对比
const currentProductForComparison = computed(() => {
  if (!productData.value) return null
  
  return {
    asin: productData.value.asin || '',
    name: productData.value.productName || '当前产品',
    image: productData.value.productImage || '',
    price: '$--',
    rating: 4.5,
    reviewCount: productData.value.reviewCount || 0,
    advantages: (productData.value.productExperience?.positive || []).map(item => ({
      en: item.desc || '',
      cn: item.descCn || ''
    })),
    disadvantages: (productData.value.productExperience?.negative || []).map(item => ({
      en: item.desc || '',
      cn: item.descCn || ''
    }))
  }
})

// 模块导航项
const navItems = [
  { id: 'consumer-profile', title: '消费者画像' },
  { id: 'usage-scenarios', title: '使用场景' },
  { id: 'star-rating', title: '星级影响度' },
  { id: 'product-experience', title: '产品体验' },
  { id: 'purchase-motivation', title: '购买动机' },
  { id: 'unmet-needs', title: '未被满足的需求' },
  { id: 'competitor-analysis', title: '竞品分析' }
]

// 滚动到指定模块
function scrollToModule(id) {
  const element = document.getElementById(id)
  if (element) {
    const navHeight = 60 // 导航栏高度
    const offsetTop = element.offsetTop - navHeight - 10
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
    activeModule.value = id
  }
}

// 处理账号点击
function handleAccountClick() {
  ElMessage({
    message: '账号功能正在开发中，敬请期待！',
    type: 'info',
    duration: 2000,
    showClose: true
  })
}

// ✅ 格式化日期
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ✅ 下载完整报告（PDF）
async function downloadReport() {
  const loading = ElLoading.service({
    lock: true,
    text: '正在生成PDF报告...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 获取页面内容区域
    const pageContent = document.querySelector('.page-content')
    
    // 生成canvas
    const canvas = await html2canvas(pageContent, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    })
    
    // 创建PDF
    const imgWidth = 210 // A4宽度（mm）
    const pageHeight = 297 // A4高度（mm）
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0
    
    // 添加图片到PDF
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // 如果内容超过一页，添加新页
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // 下载PDF
    const fileName = `Amazon评论分析报告-${productData.value.asin}-${new Date().toISOString().slice(0, 10)}.pdf`
    pdf.save(fileName)
    
    ElMessage.success('报告下载成功！')
  } catch (error) {
    console.error('生成PDF失败:', error)
    ElMessage.error('生成PDF失败，请重试')
  } finally {
    loading.close()
  }
}

// ✅ 添加竞品
async function handleAddCompetitor(asin) {
  try {
    // 创建分析任务
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asin, maxReviews: 100 })
    })
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || '创建任务失败')
    }
    
    ElMessage.info(`竞品分析任务已创建，任务ID: ${data.data.taskId}`)
    
    // 轮询任务状态
    pollCompetitorTask(data.data.taskId, asin)
  } catch (error) {
    ElMessage.error('添加竞品失败：' + error.message)
  }
}

// ✅ 轮询竞品任务状态
async function pollCompetitorTask(taskId, asin) {
  let attempts = 0
  const maxAttempts = 60
  
  const timer = setInterval(async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/status`)
      const data = await response.json()
      
      if (!data.success) {
        clearInterval(timer)
        ElMessage.error('获取竞品任务状态失败')
        return
      }
      
      const taskData = data.data
      
      if (taskData.status === 'completed') {
        clearInterval(timer)
        
        // 添加到竞品列表
        const competitor = {
          asin: asin,
          name: taskData.result.meta?.productName || asin,
          image: taskData.result.meta?.productImage || '',
          price: '$--', // 需要额外API获取价格
          rating: 4.0, // 从评论计算平均分
          reviewCount: taskData.result.reviews?.length || 0,
          advantages: (taskData.result.analysis.productExperience?.strengths || [])
            .slice(0, 5)
            .map(item => ({ en: item.desc, cn: item.descCn || item.desc })),
          disadvantages: (taskData.result.analysis.productExperience?.weaknesses || [])
            .slice(0, 5)
            .map(item => ({ en: item.desc, cn: item.descCn || item.desc }))
        }
        
        competitorsData.value.push(competitor)
        ElMessage.success(`竞品 ${asin} 分析完成！`)
      } else if (taskData.status === 'failed') {
        clearInterval(timer)
        ElMessage.error(`竞品 ${asin} 分析失败`)
      }
      
      attempts++
      if (attempts >= maxAttempts) {
        clearInterval(timer)
        ElMessage.warning('竞品分析超时，请稍后重试')
      }
    } catch (error) {
      clearInterval(timer)
      ElMessage.error('获取任务状态失败')
    }
  }, 2000)
}

// ✅ 移除竞品
function handleRemoveCompetitor(asin) {
  const index = competitorsData.value.findIndex(c => c.asin === asin)
  if (index > -1) {
    competitorsData.value.splice(index, 1)
  }
}

// 处理滚动事件
function handleScroll() {
  const moduleNav = document.querySelector('.module-nav')
  if (moduleNav && navOffsetTop.value === 0) {
    navOffsetTop.value = moduleNav.offsetTop
  }

  // 检查导航是否应该固定
  navFixed.value = window.scrollY > navOffsetTop.value

  // 检查哪个模块在可视区域内
  const scrollPosition = window.scrollY + 120
  
  for (let i = navItems.length - 1; i >= 0; i--) {
    const item = navItems[i]
    const element = document.getElementById(item.id)
    if (element && element.offsetTop <= scrollPosition) {
      activeModule.value = item.id
      break
    }
  }
}

onMounted(async () => {
  // ✅ 清除所有本地缓存，防止显示旧数据
  localStorage.removeItem('lastAnalysisResult')
  sessionStorage.clear()
  
  // 根据ASIN加载不同的数据
  const asin = route.params.asin
  
  // 如果是demo数据，直接使用mock数据
  if (asin === 'demo-earbuds') {
    productData.value = earbudsData
  } else if (asin === 'demo-apple-slicer') {
    productData.value = appleSlicerData
  } else if (asin === 'demo-laptop-backpack') {
    productData.value = laptopBackpackData
  } else {
    // ✅ 如果是真实的taskId，从后端API获取分析结果
    try {
      // 添加加载动画
      const loading = ElLoading.service({
        lock: true,
        text: '正在获取分析结果...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      let attempts = 0
      const maxAttempts = 90  // 最多等待3分钟
      let taskCompleted = false
      
      while (attempts < maxAttempts) {
        const response = await fetch(`http://localhost:3001/api/tasks/${asin}/status`)
        const data = await response.json()
        
        if (!data.success) {
          loading.close()
          throw new Error('任务不存在或已过期')
        }
        
        const taskData = data.data
        const status = taskData.status
        
        if (status === 'completed') {
          // ✅ 任务完成 - 必须有有效数据
          if (taskData.result && taskData.result.analysis) {
            // ✅ 确保数据完整性
            const analysis = taskData.result.analysis
            
            if (!analysis.consumerProfile || !analysis.usageScenarios) {
              loading.close()
              throw new Error('分析数据不完整，请重新分析')
            }
            
            productData.value = {
              asin: asin,
              productName: taskData.result.meta?.productName || 'Amazon Product Analysis',
              productNameCn: 'Amazon产品分析',
              productImage: taskData.result.meta?.productImage || taskData.productImage || '',
              reviewCount: taskData.result.reviews?.length || 0,
              analyzedAt: taskData.result.meta?.analyzedAt || taskData.createdAt || new Date().toISOString(),
              reviews: taskData.result.reviews || [], // ✅ 添加评论数据
              ...analysis
            }
            taskCompleted = true
            loading.close()
            ElMessage.success(`分析完成！共分析 ${productData.value.reviewCount} 条评论`)
            console.log('✅ 成功从API加载分析结果，ASIN:', asin)
            console.log('✅ 数据包含:', Object.keys(analysis))
          } else {
            loading.close()
            throw new Error('分析结果为空，请重新分析')
          }
          break
          
        } else if (status === 'failed') {
          loading.close()
          
          // ✅ 特殊处理API配额错误
          const errorMsg = taskData.error || '未知错误'
          if (errorMsg.includes('quota exhausted') || errorMsg.includes('配额已用完')) {
            throw new Error('⚠️ AI分析服务配额已用完，请联系管理员充值')
          } else {
            throw new Error(errorMsg)
          }
          
        } else if (status === 'pending' || status === 'scraping' || status === 'analyzing') {
          // 任务进行中，更新进度
          const progress = taskData.progress || 0
          const statusText = {
            'pending': '准备中',
            'scraping': '正在抓取评论',
            'analyzing': '任务进行中'
          }
          loading.text = `${statusText[status]} ${progress}%`
          
          await new Promise(resolve => setTimeout(resolve, 2000))
          attempts++
        }
      }
      
      if (!taskCompleted && attempts >= maxAttempts) {
        loading.close()
        throw new Error('任务超时，请稍后刷新页面重试')
      }
      
    } catch (error) {
      console.error('❌ 获取报告失败:', error)
      ElMessage.error({
        message: '加载失败：' + error.message,
        duration: 5000,
        showClose: true
      })
      
      // ❌ 不要在失败时显示demo数据！这会误导用户
      // ⚠️ 显示错误页面或空状态
      ElMessage.info({
        message: '请返回首页重新创建分析任务',
        duration: 3000
      })
      
      // 3秒后自动跳转回首页
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    }
  }

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化
})

onUnmounted(() => {
  // 移除滚动监听
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss" scoped>
.report-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
}

// 左侧导航栏 - 可收缩
.sidebar-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background: white;
  border-right: 1px solid #e5e7eb;
  z-index: 100;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.02);
  transition: width 0.3s ease;
  overflow: hidden;

  &.is-collapsed {
    width: 64px;
  }

  .sidebar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    padding: 20px 12px;
    flex: 1;
  }

  .sidebar-footer {
    padding: 20px 12px;
    border-top: 1px solid #e5e7eb;
  }

  .nav-item,
  .account-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #374151;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.2s;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;

    .nav-icon {
      font-size: 20px;
      flex-shrink: 0;
      min-width: 20px;
    }

    .nav-text {
      opacity: 1;
      transition: opacity 0.2s;
    }

    &:hover {
      background: #f3f4f6;
      color: #1f2937;
    }
  }

  // 收起状态下隐藏文字
  &.is-collapsed {
    .nav-text {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .nav-item,
    .account-section {
      justify-content: center;
      padding: 12px;
    }
  }
}

// 主内容包装器
.main-wrapper {
  flex: 1;
  margin-left: 200px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;

  &.sidebar-collapsed {
    margin-left: 64px;
  }
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 32px;
  width: 100%;
}

// 页面头部 - 简约白色风格
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .header-content {
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 8px;

    .brand-icon {
      font-size: 20px;
    }

    .brand-text {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .brand-provider {
      margin-left: 8px;
      font-size: 12px;
      color: #9ca3af;
    }
  }

  .product-header {
    padding: 20px 0 24px;
    
    // ✅ 产品图片和信息并排
    .product-header-main {
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }
    
    // ✅ 产品主图
    .product-main-image {
      width: 120px;
      height: 120px;
      object-fit: contain;
      background: white;
      border-radius: 8px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      flex-shrink: 0;
    }
    
    .product-info {
      flex: 1;
      min-width: 0; // 防止文字溢出
    }
  }

  .product-title {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 12px 0;
  }

  .product-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap; // ✅ 允许换行
    font-size: 14px;
    margin-bottom: 16px; // ✅ 与下方按钮保持间距
  }
  
  // ✅ 下载报告按钮样式
  .report-actions {
    display: flex;
    gap: 12px;
    
    .el-button {
      font-weight: 500;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .product-subtitle {
    color: #6b7280;
  }

  .divider {
    color: #d1d5db;
  }

  .asin-text {
    color: #6b7280;
    font-weight: 500;
  }
}

// 模块导航
.module-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  z-index: 90;

  &.is-fixed {
    position: fixed;
    top: 0;
    left: 200px;
    right: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: left 0.3s ease;
  }

  .nav-items {
    display: flex;
    gap: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    a {
      flex-shrink: 0;
      padding: 16px 24px;
      color: #6b7280;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        color: #374151;
        background: #f9fafb;
      }

      &.active {
        color: #2563eb;
        border-bottom-color: #2563eb;
        background: #eff6ff;
      }
    }
  }
}

// 当侧边栏收起时，调整模块导航位置
.sidebar-collapsed {
  .module-nav.is-fixed {
    left: 64px;
  }
}

// 主内容区
.page-content {
  padding: 32px 0;
  flex: 1;
}

.module-section {
  scroll-margin-top: 80px;
}

// 页脚
.page-footer {
  background: #1f2937;
  color: white;
  padding: 32px 0;
  margin-top: 48px;

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-info {
    p {
      margin: 4px 0;
      font-size: 14px;
    }

    .disclaimer {
      opacity: 0.7;
      font-size: 13px;
    }
  }

  .footer-links {
    display: flex;
    gap: 24px;

    a {
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .sidebar-nav {
    width: 64px;

    &.is-collapsed {
      width: 64px;
    }

    .nav-text {
      opacity: 0;
      width: 0;
    }

    .nav-item,
    .account-section {
      justify-content: center;
      padding: 12px;
    }
  }

  .main-wrapper {
    margin-left: 64px;

    &.sidebar-collapsed {
      margin-left: 64px;
    }
  }

  .module-nav.is-fixed {
    left: 64px;
  }
}

@media (max-width: 768px) {
  .page-header {
    .product-title {
      font-size: 20px;
    }

    .product-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;

      .divider {
        display: none;
      }
    }
  }

  .page-footer {
    .footer-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .footer-links {
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>


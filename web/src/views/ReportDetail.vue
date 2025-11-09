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

      <!-- ✅ Tab导航 - 对标Shulex -->
      <div class="tab-nav">
        <div class="container">
          <el-tabs v-model="activeTab" class="report-tabs">
            <el-tab-pane label="消费者洞察" name="insights"></el-tab-pane>
            <el-tab-pane label="竞品分析" name="competitor"></el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="page-content">
        <div class="container">
          <!-- ✅ Tab内容区 - 消费者洞察 -->
          <div v-show="activeTab === 'insights'" class="tab-content-insights">
            <!-- 消费者洞察标题 -->
            <div class="insights-header">
              <h2 class="tab-main-title">📊 消费者洞察</h2>
              <p class="tab-main-description">基于AI分析评论数据，深度洞察消费者画像、使用场景、产品体验和购买动机</p>
            </div>

          <!-- 消费者画像 -->
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
          </div>

          <!-- ✅ Tab内容区 - 竞品分析 -->
          <div v-show="activeTab === 'competitor'" class="tab-content-competitor">
            <!-- 竞品分析标题 -->
            <div class="competitor-header">
              <h2 class="tab-main-title">🎯 竞品分析</h2>
              <p class="tab-main-description">多维度对比竞品，发现市场机会和产品优势</p>
            </div>
            
            <div class="module-section">
              <CompetitorAnalysis
                :current-product="currentProductForComparison"
                :competitors="competitorsData"
                @add-competitor="handleAddCompetitor"
                @remove-competitor="handleRemoveCompetitor"
              />
            </div>
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
const productData = ref({
  asin: '',
  productName: '',
  productNameCn: '',
  productImage: '',
  reviewCount: 0,
  reviews: [],
  consumerProfile: null,
  usageScenarios: [],
  starRatingImpact: null,
  productExperience: { strengths: [], weaknesses: [] },
  purchaseMotivation: [],
  unmetNeeds: []
}) // ✅ 不再默认使用earbuds数据
const sidebarExpanded = ref(false) // 侧边栏展开状态
const activeTab = ref('insights') // ✅ Tab状态：insights | competitor

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

// ✅ 移除旧的模块导航逻辑，改用Tab

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
    const response = await fetch('/api/analyze', {
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
      const response = await fetch(`/api/tasks/${taskId}/status`)
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

// ✅ 移除handleScroll，改用Tab导航

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
        const response = await fetch(`/api/tasks/${asin}/status`)
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
            // ✅ 确保数据完整性（放宽检查，允许部分维度失败）
            const analysis = taskData.result.analysis
            
            if (!analysis.consumerProfile) {
              loading.close()
              throw new Error('关键分析数据缺失（消费者画像），请重新分析')
            }
            
            // ⚠️ 警告：如果使用场景为空
            if (!analysis.usageScenarios || analysis.usageScenarios.length === 0) {
              console.warn('⚠️ 使用场景数据为空，可能AI分析失败')
            }
            
            // ✅ 明确赋值每个字段，确保数据结构正确
            productData.value = {
              asin: asin,
              productName: taskData.result.meta?.productTitle || taskData.result.meta?.productName || 'Amazon Product Analysis',
              productNameCn: taskData.result.meta?.productTitle || 'Amazon产品分析',
              productImage: taskData.result.meta?.productImage || taskData.productImage || '',
              reviewCount: taskData.result.reviews?.length || 0,
              analyzedAt: taskData.result.meta?.analyzedAt || taskData.createdAt || new Date().toISOString(),
              reviews: taskData.result.reviews || [],
              // ✅ 明确赋值每个分析维度
              consumerProfile: analysis.consumerProfile || null,
              usageScenarios: analysis.usageScenarios || [],
              starRatingImpact: analysis.starRatingImpact || null,
              productExperience: {
                positive: analysis.productExperience?.strengths || [],
                negative: analysis.productExperience?.weaknesses || [],
                strengths: analysis.productExperience?.strengths || [],
                weaknesses: analysis.productExperience?.weaknesses || []
              },
              purchaseMotivation: analysis.purchaseMotivation || [],
              unmetNeeds: analysis.unmetNeeds || []
            }
            
            // ✅ 调试日志
            console.log('✅ 数据已加载:')
            console.log('  - consumerProfile:', productData.value.consumerProfile ? 'OK' : 'NULL')
            console.log('  - usageScenarios:', productData.value.usageScenarios?.length || 0, '条')
            console.log('  - productExperience.strengths:', productData.value.productExperience?.strengths?.length || 0, '条')
            console.log('  - productExperience.weaknesses:', productData.value.productExperience?.weaknesses?.length || 0, '条')
            console.log('  - purchaseMotivation:', productData.value.purchaseMotivation?.length || 0, '条')
            console.log('  - unmetNeeds:', productData.value.unmetNeeds?.length || 0, '条')
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

  // ✅ 移除滚动监听，改用Tab导航
})

onUnmounted(() => {
  // 清理工作
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
// ✅ Tab导航样式
.tab-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
    top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  :deep(.report-tabs) {
    .el-tabs__header {
      margin: 0;
      border-bottom: none;
    }

    .el-tabs__nav-wrap::after {
      display: none;
    }

    .el-tabs__item {
      font-size: 16px;
      font-weight: 500;
      padding: 0 24px;
      height: 56px;
      line-height: 56px;
      color: #6b7280;
      transition: all 0.2s;

      &:hover {
        color: #3b82f6;
      }

      &.is-active {
        color: #3b82f6;
        font-weight: 600;
      }
    }

    .el-tabs__active-bar {
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
    }
  }
}

// 主内容区
.page-content {
  padding: 32px 0;
  flex: 1;
}

.module-section {
  scroll-margin-top: 80px;
  margin-bottom: 24px;
}

// ✅ Tab内容区标题
.insights-header,
.competitor-header {
  margin: 32px 0 24px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);

  .tab-main-title {
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-main-description {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    line-height: 1.6;
  }
}

.competitor-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.2);
}

// ✅ 响应式
@media (max-width: 768px) {
  .insights-header,
  .competitor-header {
    margin: 24px 0 16px;
    padding: 16px;

    .tab-main-title {
      font-size: 20px;
    }

    .tab-main-description {
      font-size: 13px;
    }
  }
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


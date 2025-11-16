<template>
  <div class="home-page">
    <!-- 左侧导航栏 - 可收缩 -->
    <div 
      class="sidebar-nav" 
      :class="{ 'is-collapsed': !sidebarExpanded }"
      @mouseenter="sidebarExpanded = true"
      @mouseleave="sidebarExpanded = false"
    >
      <div class="sidebar-content">
        <div class="sidebar-header">
          <router-link to="/" class="nav-item active">
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
      <!-- 顶部提示条 -->
      <div class="top-banner">
        <div class="banner-content">
          <span>🎁 自助模式免费试用中，您仅需在3天内创建2份报告。</span>
          <span class="banner-en">Please create reports within 3 days to view all the features: Customer Profile, Usage Scenario, Rating Optimization, etc</span>
          <button class="upgrade-btn">Upgrade</button>
        </div>
      </div>

      <!-- 主标题区域 -->
      <div class="hero-section">
      <div class="container">
        <h1 class="main-title">Amazon Review Analysis</h1>
        <h2 class="main-title-cn">亚马逊评论分析</h2>
        <p class="subtitle">AI analyzes Amazon reviews to gain consumer insights</p>
        <p class="subtitle-cn">人工智能分析亚马逊评论以获取消费者洞察</p>

        <!-- 搜索区域 -->
        <div class="search-section">
          <div class="search-wrapper">
            <!-- 国家站点选择 -->
            <el-dropdown trigger="click" @command="handleCountryChange">
              <div class="country-selector">
                <span class="flag-icon">{{ currentCountry.flag }}</span>
                <el-icon class="arrow-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item 
                    v-for="country in countries" 
                    :key="country.code"
                    :command="country.code"
                  >
                    <span class="flag-icon">{{ country.flag }}</span>
                    <span>{{ country.name }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 搜索输入框 -->
            <el-input
              v-model="searchQuery"
              class="search-input"
              placeholder="Enter product keyword or ASIN to generate a report..."
              clearable
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button 
                  type="primary" 
                  :icon="Search"
                  @click="handleSearch"
                  :loading="isSearching"
                >
                  Search
                </el-button>
              </template>
            </el-input>
          </div>
        </div>

        <!-- 功能标签 -->
        <div class="feature-tags">
          <div 
            v-for="feature in features" 
            :key="feature.id"
            class="feature-tag"
          >
            <span class="feature-name-en">{{ feature.nameEn }}</span>
            <span class="feature-name-cn">{{ feature.nameCn }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Report List 报告列表 -->
    <div class="report-list-section">
      <div class="container">
        <div class="section-header">
          <div class="header-left">
            <h3 class="section-title">
              Report List 
              <span class="title-cn">报告清单</span>
            </h3>
            <p class="section-subtitle">
              Analysis time reduced from one week to one minute
              <span class="subtitle-cn">分析时间从一周缩短至一分钟</span>
            </p>
          </div>
          <div class="header-right">
            <el-input
              v-model="reportSearchQuery"
              class="report-search"
              placeholder="Search report name"
              :prefix-icon="Search"
              clearable
            />
            <el-button class="learn-btn" :icon="VideoPlay">Learn</el-button>
            <el-button 
              type="primary" 
              class="create-btn"
              :icon="Plus"
              @click="showCreateDialog = true"
            >
              Create Report
              <span class="btn-text-cn">创建报告</span>
            </el-button>
          </div>
        </div>

        <!-- 报告卡片网格 -->
        <div class="report-grid" v-if="filteredReports.length > 0">
          <div 
            v-for="report in filteredReports" 
            :key="report.id"
            class="report-card"
            @click="goToReport(report.asin, report)"
          >
            <div class="card-image">
              <!-- ✅ 优先显示产品图片 -->
              <img 
                v-if="report.productImage" 
                :src="report.productImage" 
                :alt="report.name"
                class="product-image"
                @error="handleImageError"
              />
              <!-- 降级显示占位符 -->
              <div v-else class="image-placeholder">
                <span class="placeholder-icon">📦</span>
              </div>
              <span class="demo-badge" v-if="report.isDemo">Demo</span>
            </div>
            <div class="card-content">
              <h4 class="card-title">{{ report.name }}</h4>
              <div class="card-meta">
                <span class="meta-item">Total ASIN: {{ report.totalAsin }}</span>
                <span class="meta-item">{{ report.createdAt }}</span>
              </div>
              
              <!-- ✅ 状态和进度显示 -->
              <div v-if="report.status === 'analyzing'" class="status-section analyzing">
                <el-progress :percentage="report.progress" :stroke-width="6" />
                <span class="status-text">{{ report.progress }}% 分析中...</span>
              </div>
              <div v-else-if="report.status === 'completed'" class="status-section completed">
                <el-icon class="status-icon success"><SuccessFilled /></el-icon>
                <span class="status-text">分析完成</span>
              </div>
              <div v-else-if="report.status === 'failed'" class="status-section failed">
                <el-icon class="status-icon error"><CircleCloseFilled /></el-icon>
                <span class="status-text">分析失败</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <el-empty description="暂无报告">
            <el-button type="primary" @click="showCreateDialog = true">
              创建第一个报告
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>

      <!-- 底部说明 -->
      <div class="footer-section">
        <div class="container">
          <p class="footer-text">
            Over 70,000+ users are currently using SHULEX VOC
          </p>
          <p class="footer-text-cn">
            目前有超过 70,000 多个用户正在使用 SHULEX VOC
          </p>
        </div>
      </div>
    </div>

    <!-- 创建报告对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="创建新报告"
      width="600px"
    >
      <el-form :model="newReport" label-width="120px">
        <el-form-item label="产品关键词/ASIN">
          <el-input 
            v-model="newReport.keyword" 
            placeholder="输入产品关键词或ASIN"
          />
        </el-form-item>
        <el-form-item label="国家站点">
          <el-select v-model="newReport.country" placeholder="选择站点">
            <el-option
              v-for="country in countries"
              :key="country.code"
              :label="country.name"
              :value="country.code"
            >
              <span>{{ country.flag }} {{ country.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreateReport" :loading="isCreating">
          开始分析
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, Search, VideoPlay, Plus, HomeFilled, User, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 侧边栏展开状态
const sidebarExpanded = ref(false)

// 当前选择的国家站点
const currentCountry = ref({
  code: 'us',
  name: 'United States',
  flag: '🇺🇸',
  domain: 'amazon.com'
})

// 国家站点列表
const countries = [
  { code: 'us', name: 'United States', flag: '🇺🇸', domain: 'amazon.com' },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', domain: 'amazon.co.uk' },
  { code: 'de', name: 'Germany', flag: '🇩🇪', domain: 'amazon.de' },
  { code: 'fr', name: 'France', flag: '🇫🇷', domain: 'amazon.fr' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵', domain: 'amazon.co.jp' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', domain: 'amazon.ca' }
]

// 功能标签
const features = [
  { id: 1, nameEn: 'Customer Profile', nameCn: '客户画像' },
  { id: 2, nameEn: 'Usage Scenario', nameCn: '使用场景' },
  { id: 3, nameEn: 'Rating Optimization', nameCn: '评级优化' },
  { id: 4, nameEn: 'Customer Sentiment', nameCn: '客户情绪' },
  { id: 5, nameEn: 'Customer Expectation', nameCn: '客户期望' },
  { id: 6, nameEn: 'Purchase Motivations', nameCn: '购买动机' }
]

// 搜索相关
const searchQuery = ref('')
const isSearching = ref(false)
const reportSearchQuery = ref('')

// 报告列表
const reports = ref([
  {
    id: 1,
    name: 'US / 手机支架车载磁吸无线...',
    asin: 'demo-earbuds',
    totalAsin: 3,
    createdAt: '2025/10/20 13:47',
    isDemo: true
  },
  {
    id: 2,
    name: 'Earbud Headphones...',
    asin: 'demo-apple-slicer',
    totalAsin: 90,
    createdAt: '2025/10/19 10:20',
    isDemo: true
  },
  {
    id: 3,
    name: 'Laptop Backpack...',
    asin: 'demo-laptop-backpack',
    totalAsin: 8,
    createdAt: '2025/10/18 15:30',
    isDemo: true
  }
])

// 创建报告对话框
const showCreateDialog = ref(false)
const isCreating = ref(false)
const newReport = ref({
  keyword: '',
  country: 'us'
})

// 过滤报告列表
const filteredReports = computed(() => {
  if (!reportSearchQuery.value) {
    return reports.value
  }
  const query = reportSearchQuery.value.toLowerCase()
  return reports.value.filter(report => 
    report.name.toLowerCase().includes(query) ||
    report.asin.toLowerCase().includes(query)
  )
})

// 处理账号点击
function handleAccountClick() {
  ElMessage({
    message: '账号功能正在开发中，敬请期待！',
    type: 'info',
    duration: 2000,
    showClose: true
  })
}

// 处理国家站点切换
function handleCountryChange(code) {
  const country = countries.find(c => c.code === code)
  if (country) {
    currentCountry.value = country
    ElMessage.success(`已切换到 ${country.name} 站点`)
  }
}

// 处理搜索
async function handleSearch() {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入产品关键词或ASIN')
    return
  }

  isSearching.value = true
  
  try {
    // ✅ 提取ASIN（支持URL或纯ASIN）
    let asin = searchQuery.value.trim()
    const asinMatch = asin.match(/\/dp\/([A-Z0-9]{10})/)
    if (asinMatch) {
      asin = asinMatch[1]
    }
    
    // 验证ASIN格式
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      ElMessage.warning('请输入有效的ASIN（10位字母和数字）或Amazon产品链接')
      isSearching.value = false
      return
    }
    
    ElMessage.info(`正在创建分析任务: ${asin}`)
    
    // ✅ 调用后端API创建任务
    const response = await fetch('/api/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asin: asin,
        productUrl: `https://www.${currentCountry.value.domain}/dp/${asin}`,
        reviewCount: 1000,  // ✅ Web端完整分析：最多1000条评论
        analysisMode: 'full',  // ✅ 标记为完整分析模式
        source: 'web-frontend-full',
        analysisOptions: {
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
      const taskId = result.data.taskId
      
      // ✅ 添加新报告到列表
      reports.value.unshift({
        id: Date.now(),
        name: `分析中... (${asin})`,
        asin: taskId,
        totalAsin: 0,
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '/').replace(',', ''),
        isDemo: false,
        status: 'analyzing',
        progress: 0,
        realAsin: asin
      })
      
      ElMessage.success('任务创建成功！正在后台分析，请稍候...')
      searchQuery.value = '' // 清空搜索框
      
      // ✅ 开始轮询任务状态
      pollTaskStatus(taskId, reports.value[0])
      
    } else {
      throw new Error(result.message || '创建失败')
    }
    
  } catch (error) {
    console.error('创建任务失败:', error)
    ElMessage.error('创建失败：' + error.message)
  } finally {
    isSearching.value = false
  }
}

// 创建报告
async function handleCreateReport() {
  if (!newReport.value.keyword.trim()) {
    ElMessage.warning('请输入产品关键词或ASIN')
    return
  }

  isCreating.value = true
  
  try {
    // ✅ 提取ASIN（支持URL或纯ASIN）
    let asin = newReport.value.keyword.trim()
    const asinMatch = asin.match(/\/dp\/([A-Z0-9]{10})/)
    if (asinMatch) {
      asin = asinMatch[1]
    }
    
    // 验证ASIN格式
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      ElMessage.warning('请输入有效的ASIN（10位字母和数字）或Amazon产品链接')
      isCreating.value = false
      return
    }
    
    ElMessage.info(`正在创建分析任务: ${asin}`)
    
    // ✅ 调用后端API创建任务
    const selectedCountry = countries.find(c => c.code === newReport.value.country) || currentCountry.value
    const response = await fetch('/api/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asin: asin,
        productUrl: `https://www.${selectedCountry.domain}/dp/${asin}`,
        reviewCount: 1000,  // ✅ Web端完整分析：最多1000条评论
        analysisMode: 'full',  // ✅ 标记为完整分析模式
        source: 'web-frontend-full',
        analysisOptions: {
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
      const taskId = result.data.taskId
      
      // ✅ 添加新报告到列表（不跳转，留在首页）
      reports.value.unshift({
        id: Date.now(),
        name: `分析中... (${asin})`,
        asin: taskId, // 使用taskId作为标识
        totalAsin: 0,
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '/').replace(',', ''),
        isDemo: false,
        status: 'analyzing', // 新增状态字段
        progress: 0,
        realAsin: asin // 保存真实ASIN
      })
      
      ElMessage.success('任务创建成功！正在后台分析，请稍候...')
      showCreateDialog.value = false
      newReport.value.keyword = '' // 清空表单
      
      // ✅ 开始轮询任务状态
      pollTaskStatus(taskId, reports.value[0])
      
    } else {
      throw new Error(result.message || '创建失败')
    }
    
  } catch (error) {
    console.error('创建报告失败:', error)
    ElMessage.error('创建失败：' + error.message)
  } finally {
    isCreating.value = false
  }
}

// 跳转到报告详情
function goToReport(asin, report) {
  // ✅ 如果任务正在进行中，提示用户等待
  if (report && report.status === 'analyzing') {
    ElMessage.info('报告正在分析中，请稍候...')
    return
  }
  
  // ✅ 如果任务失败，提示用户
  if (report && report.status === 'failed') {
    ElMessage.error('该报告分析失败，无法查看')
    return
  }
  
  router.push(`/report/${asin}`)
}

// 图片加载失败处理
function handleImageError(event) {
  // 图片加载失败时隐藏img标签，显示占位符
  event.target.style.display = 'none'
}

// ✅ 轮询任务状态
async function pollTaskStatus(taskId, report) {
  let attempts = 0
  const POLL_INTERVAL = 2000 // 2秒轮询一次
  const MAX_WAIT_TIME = 10 * 60 * 1000 // 10分钟上限，避免长任务被判失败
  const maxAttempts = Math.ceil(MAX_WAIT_TIME / POLL_INTERVAL)
  
  const poll = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`)
      const data = await response.json()
      
      if (data.success) {
        const taskData = data.data
        
        // 更新进度
        report.progress = taskData.progress || 0
        
        const statusMap = {
          'pending': '准备中',
          'scraping': '正在抓取评论',
          'analyzing': '任务进行中',
          'completed': '分析完成',
          'failed': '分析失败'
        }
        
        if (taskData.status === 'completed') {
          report.status = 'completed'
          report.name = `${report.realAsin || taskId.slice(0, 8)} - 已完成`
          report.totalAsin = taskData.result?.reviews?.length || 0
          // ✅ 保存产品图片
          if (taskData.result?.meta?.productImage) {
            report.productImage = taskData.result.meta.productImage
          }
          ElMessage.success({
            message: `分析完成！共分析 ${report.totalAsin} 条评论`,
            duration: 3000
          })
          return // 停止轮询
          
        } else if (taskData.status === 'failed') {
          report.status = 'failed'
          report.name = `${report.realAsin || taskId.slice(0, 8)} - 失败`
          
          // ✅ 特殊处理API配额错误
          const errorMsg = taskData.error || '未知错误'
          if (errorMsg.includes('quota exhausted') || errorMsg.includes('配额已用完')) {
            ElMessage.error({
              message: '⚠️ AI分析服务配额已用完，请联系管理员充值',
              duration: 5000,
              showClose: true
            })
          } else {
            ElMessage.error('分析失败：' + errorMsg)
          }
          return // 停止轮询
          
        } else if (attempts < maxAttempts) {
          // 继续轮询
          const statusText = statusMap[taskData.status] || '处理中'
          report.name = `${report.realAsin || taskId.slice(0, 8)} - ${statusText}`
          attempts++
          setTimeout(poll, POLL_INTERVAL) // 2秒后再次轮询
          
        } else {
          // 超时
          report.status = 'failed'
          report.name = `${report.realAsin || taskId.slice(0, 8)} - 超时`
          ElMessage.error('分析超时，请稍后重试')
        }
      } else {
        throw new Error('查询任务状态失败')
      }
    } catch (error) {
      console.error('轮询失败:', error)
      report.status = 'failed'
      report.name = `${report.realAsin || taskId.slice(0, 8)} - 网络错误`
      ElMessage.error('网络错误，请检查后端服务')
    }
  }
  
  poll()
}

// 加载报告列表
async function loadReports() {
  try {
    // ✅ 从后端API获取历史报告列表
    const response = await fetch('/api/tasks')
    const data = await response.json()
    if (data.success && data.data && data.data.length > 0) {
      // 合并后端任务和Demo报告
      const backendTasks = data.data.map(task => ({
        id: task.taskId,
        name: task.asin ? `${task.asin} - ${task.status}` : task.taskId.slice(0, 8),
        asin: task.taskId,
        realAsin: task.asin,
        totalAsin: task.result?.reviews?.length || 0,
        createdAt: new Date(task.createdAt).toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '/'),
        isDemo: false,
        status: task.status === 'completed' ? 'completed' : 
                task.status === 'failed' ? 'failed' : 'analyzing',
        progress: task.progress || 0,
        productImage: task.result?.meta?.productImage
      }))
      
      // 后端任务 + Demo报告
      reports.value = [...backendTasks, ...reports.value.filter(r => r.isDemo)]
      
      // ✅ 为进行中的任务启动轮询
      backendTasks.forEach(task => {
        if (task.status === 'analyzing') {
          pollTaskStatus(task.asin, task)
        }
      })
      
      console.log(`报告列表已加载：${backendTasks.length}个后端任务 + ${reports.value.filter(r => r.isDemo).length}个Demo`)
    } else {
      console.log('报告列表已加载（仅显示Demo数据）')
    }
  } catch (error) {
    console.error('加载报告列表失败:', error)
    ElMessage.warning('加载报告列表失败，仅显示Demo报告')
  }
}

onMounted(() => {
  loadReports()
})
</script>

<style lang="scss" scoped>
.home-page {
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
    color: #1F2937;
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

    &.active {
      background: #eff6ff;
      color: #2563eb;
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

// 顶部Banner
.top-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 0;

  .banner-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;

    .banner-en {
      opacity: 0.9;
      font-size: 13px;
    }

    .upgrade-btn {
      background: white;
      color: #667eea;
      border: none;
      padding: 6px 20px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

// 主标题区域
.hero-section {
  background: white;
  padding: 48px 0 64px;
  border-bottom: 1px solid #e5e7eb;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .main-title {
    font-size: 48px;
    font-weight: 700;
    color: #111827;
    text-align: center;
    margin: 0 0 8px 0;
  }

  .main-title-cn {
    font-size: 36px;
    font-weight: 600;
    color: #374151;
    text-align: center;
    margin: 0 0 24px 0;
  }

  .subtitle {
    font-size: 18px;
    color: #6b7280;
    text-align: center;
    margin: 0 0 6px 0;
  }

  .subtitle-cn {
    font-size: 16px;
    color: #9ca3af;
    text-align: center;
    margin: 0 0 40px 0;
    display: block;
  }
}

// 搜索区域
.search-section {
  margin: 40px 0 32px;

  .search-wrapper {
    display: flex;
    gap: 0;
    max-width: 900px;
    margin: 0 auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
  }

  .country-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px 16px;
    min-height: 48px;
    background: white;
    border: none;
    border-right: 1px solid #e5e7eb;
    outline: none;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f9fafb;
    }

    &:focus, &:active {
      border: none;
      border-right: 1px solid #e5e7eb;
      outline: none;
      box-shadow: none;
    }
  }

  // 移除 Element Plus Dropdown 的默认样式
  :deep(.el-dropdown) {
    border: none;
    outline: none;
    
    &:focus, &:active {
      border: none;
      outline: none;
    }

    .flag-icon {
      font-size: 24px;
      line-height: 1;
    }

    .arrow-icon {
      color: #9ca3af;
      font-size: 16px;
    }
  }

  .search-input {
    flex: 1;

    :deep(.el-input__wrapper) {
      box-shadow: none !important;
      border-radius: 0;
      padding: 12px 20px;
      min-height: 48px;
    }

    :deep(.el-input__inner) {
      font-size: 15px;
      line-height: 1.5;
    }

    :deep(.el-input-group__append) {
      background: #2563eb;
      border: none;
      padding: 0;
      box-shadow: none;

      .el-button {
        background: #2563eb;
        border: none;
        color: white;
        padding: 12px 32px;
        min-height: 48px;
        font-size: 15px;
        font-weight: 600;

        &:hover {
          background: #1d4ed8;
        }
      }
    }
  }
}

// 功能标签
.feature-tags {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 32px;

  .feature-tag {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 20px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s;

    &:hover {
      background: white;
      border-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    }

    .feature-name-en {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .feature-name-cn {
      font-size: 12px;
      color: #6b7280;
    }
  }
}

// 报告列表区域
.report-list-section {
  padding: 48px 0 80px;

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-left {
    flex: 1;

    .section-title {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;

      .title-cn {
        margin-left: 8px;
        color: #6b7280;
      }
    }

    .section-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0;

      .subtitle-cn {
        margin-left: 8px;
        color: #9ca3af;
      }
    }
  }

  .header-right {
    display: flex;
    gap: 12px;
    align-items: center;

    .report-search {
      width: 200px;
    }

    .create-btn {
      .btn-text-cn {
        margin-left: 4px;
      }
    }
  }
}

// 报告卡片网格
.report-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  .report-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-image {
      position: relative;
      width: 100%;
      height: 200px;
      background: #f9fafb;
      display: flex;
      align-items: center;
      justify-content: center;

      // ✅ 真实产品图片样式
      .product-image {
        width: 100%;
        height: 100%;
        object-fit: contain; // 保持比例，完整显示
        background: white;
        padding: 16px;
      }
      
      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        .placeholder-icon {
          font-size: 64px;
          opacity: 0.3;
        }
      }

      .demo-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        background: #2563eb;
        color: white;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .card-content {
      padding: 16px;

      .card-title {
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 12px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .card-meta {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #6b7280;

        .meta-item {
          &:first-child {
            color: #2563eb;
            font-weight: 500;
          }
        }
      }
      
      // ✅ 状态显示样式
      .status-section {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f3f4f6;
        
        &.analyzing {
          .status-text {
            display: block;
            margin-top: 6px;
            font-size: 12px;
            color: #3b82f6;
            font-weight: 500;
          }
          
          :deep(.el-progress__text) {
            font-size: 12px !important;
          }
        }
        
        &.completed {
          display: flex;
          align-items: center;
          gap: 6px;
          
          .status-icon.success {
            font-size: 18px;
            color: #10b981;
          }
          
          .status-text {
            font-size: 13px;
            color: #10b981;
            font-weight: 500;
          }
        }
        
        &.failed {
          display: flex;
          align-items: center;
          gap: 6px;
          
          .status-icon.error {
            font-size: 18px;
            color: #ef4444;
          }
          
          .status-text {
            font-size: 13px;
            color: #ef4444;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 空状态
.empty-state {
  padding: 60px 0;
  text-align: center;
}

// 底部说明
.footer-section {
  background: white;
  padding: 32px 0;
  border-top: 1px solid #e5e7eb;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    text-align: center;
  }

  .footer-text {
    font-size: 16px;
    color: #1F2937;
    margin: 0 0 6px 0;
  }

  .footer-text-cn {
    font-size: 14px;
    color: #1F2937;
    margin: 0;
  }
}

// 响应式
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
}

@media (max-width: 768px) {
  .top-banner {
    .banner-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .banner-en {
        display: none;
      }
    }
  }

  .hero-section {
    padding: 32px 0 48px;

    .main-title {
      font-size: 32px;
    }

    .main-title-cn {
      font-size: 24px;
    }

    .subtitle {
      font-size: 16px;
    }

    .subtitle-cn {
      font-size: 14px;
    }
  }

  .search-wrapper {
    flex-direction: column !important;

    .country-selector {
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 16px;
    }
  }

  .feature-tags {
    gap: 12px;

    .feature-tag {
      padding: 8px 16px;
    }
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .header-right {
    width: 100%;
    flex-direction: column;

    .report-search {
      width: 100%;
    }
  }

  .report-grid {
    grid-template-columns: 1fr;
  }
}
</style>



































<template>
  <div class="module-container competitor-analysis-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">🎯</span>
        <h3 class="module-title">竞品分析</h3>
      </div>
      <div class="header-right">
        <el-button size="small" @click="handleAddCompetitor">
          <el-icon><Plus /></el-icon>
          添加竞品
        </el-button>
        <el-button size="small" @click="handleTranslate">
          {{ isTranslated ? '还原' : '翻译' }}
        </el-button>
        <el-dropdown @command="handleDownload">
          <el-button size="small">
            下载 <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="xlsx">📊 下载对比数据</el-dropdown-item>
              <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 说明文字 -->
    <div class="module-description">
      对比分析本产品与竞品的优势、劣势，发现市场机会和差异化定位
    </div>

    <!-- 竞品对比表格 -->
    <div v-if="hasCompetitors" class="competitor-comparison">
      <div class="comparison-header">
        <div class="header-cell product-header">
          <div class="product-badge current">当前产品</div>
          <div class="product-info">
            <img v-if="currentProduct.image" :src="currentProduct.image" class="product-thumb" />
            <div class="product-details">
              <div class="product-name">{{ currentProduct.name }}</div>
              <div class="product-asin">{{ currentProduct.asin }}</div>
              <div class="product-stats">
                <span class="stat-item">⭐ {{ currentProduct.rating }}</span>
                <span class="stat-item">💬 {{ currentProduct.reviewCount }} 评论</span>
              </div>
            </div>
          </div>
        </div>
        <div 
          v-for="competitor in displayedCompetitors" 
          :key="competitor.asin"
          class="header-cell competitor-header"
        >
          <div class="product-badge competitor">竞品</div>
          <div class="product-info">
            <img v-if="competitor.image" :src="competitor.image" class="product-thumb" />
            <div class="product-details">
              <div class="product-name">{{ competitor.name }}</div>
              <div class="product-asin">{{ competitor.asin }}</div>
              <div class="product-stats">
                <span class="stat-item">⭐ {{ competitor.rating }}</span>
                <span class="stat-item">💬 {{ competitor.reviewCount }} 评论</span>
              </div>
            </div>
          </div>
          <el-button 
            size="small" 
            text 
            type="danger"
            @click="removeCompetitor(competitor.asin)"
          >
            移除
          </el-button>
        </div>
      </div>

      <!-- 对比维度 -->
      <div class="comparison-body">
        <!-- 价格对比 -->
        <div class="comparison-row">
          <div class="dimension-label">💰 价格</div>
          <div class="dimension-value">{{ currentProduct.price || '--' }}</div>
          <div 
            v-for="competitor in displayedCompetitors" 
            :key="'price-' + competitor.asin"
            class="dimension-value"
            :class="{ 'better': isPriceBetter(competitor.price, currentProduct.price) }"
          >
            {{ competitor.price || '--' }}
          </div>
        </div>

        <!-- 评分对比 -->
        <div class="comparison-row">
          <div class="dimension-label">⭐ 评分</div>
          <div class="dimension-value">
            <el-rate v-model="currentProduct.rating" disabled show-score />
          </div>
          <div 
            v-for="competitor in displayedCompetitors" 
            :key="'rating-' + competitor.asin"
            class="dimension-value"
            :class="{ 'worse': competitor.rating < currentProduct.rating }"
          >
            <el-rate v-model="competitor.rating" disabled show-score />
          </div>
        </div>

        <!-- 评论数对比 -->
        <div class="comparison-row">
          <div class="dimension-label">💬 评论数</div>
          <div class="dimension-value">{{ currentProduct.reviewCount }}</div>
          <div 
            v-for="competitor in displayedCompetitors" 
            :key="'reviews-' + competitor.asin"
            class="dimension-value"
            :class="{ 'worse': competitor.reviewCount < currentProduct.reviewCount }"
          >
            {{ competitor.reviewCount }}
          </div>
        </div>

        <!-- 核心优势对比 -->
        <div class="comparison-row highlight-row">
          <div class="dimension-label">✨ 核心优势</div>
          <div class="dimension-value advantages">
            <el-tag 
              v-for="(adv, index) in currentProduct.advantages.slice(0, 3)" 
              :key="index"
              type="success"
              size="small"
            >
              {{ isTranslated ? (adv.cn || adv.en) : adv.en }}
            </el-tag>
          </div>
          <div 
            v-for="competitor in displayedCompetitors" 
            :key="'adv-' + competitor.asin"
            class="dimension-value advantages"
          >
            <el-tag 
              v-for="(adv, index) in competitor.advantages.slice(0, 3)" 
              :key="index"
              size="small"
            >
              {{ isTranslated ? (adv.cn || adv.en) : adv.en }}
            </el-tag>
          </div>
        </div>

        <!-- 主要劣势对比 -->
        <div class="comparison-row highlight-row">
          <div class="dimension-label">⚠️ 主要劣势</div>
          <div class="dimension-value disadvantages">
            <el-tag 
              v-for="(dis, index) in currentProduct.disadvantages.slice(0, 3)" 
              :key="index"
              type="danger"
              size="small"
            >
              {{ isTranslated ? (dis.cn || dis.en) : dis.en }}
            </el-tag>
          </div>
          <div 
            v-for="competitor in displayedCompetitors" 
            :key="'dis-' + competitor.asin"
            class="dimension-value disadvantages"
          >
            <el-tag 
              v-for="(dis, index) in competitor.disadvantages.slice(0, 3)" 
              :key="index"
              type="warning"
              size="small"
            >
              {{ isTranslated ? (dis.cn || dis.en) : dis.en }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无竞品数据">
        <el-button type="primary" @click="handleAddCompetitor">
          <el-icon><Plus /></el-icon>
          添加竞品进行对比分析
        </el-button>
      </el-empty>
    </div>

    <!-- 市场机会分析 -->
    <div v-if="hasCompetitors" class="market-opportunities">
      <h4 class="section-title">📈 市场机会</h4>
      <div class="opportunities-grid">
        <div 
          v-for="(opp, index) in marketOpportunities" 
          :key="index"
          class="opportunity-card"
        >
          <div class="opportunity-icon">{{ opp.icon }}</div>
          <div class="opportunity-content">
            <div class="opportunity-title">{{ opp.title }}</div>
            <div class="opportunity-desc">{{ opp.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加竞品对话框 -->
    <el-dialog
      v-model="addCompetitorDialogVisible"
      title="添加竞品"
      width="500px"
    >
      <el-form :model="newCompetitor" label-width="80px">
        <el-form-item label="ASIN">
          <el-input 
            v-model="newCompetitor.asin" 
            placeholder="输入竞品ASIN，如：B09FL6YR9L"
          />
        </el-form-item>
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <template #title>
            输入竞品ASIN后，系统将自动爬取并分析该产品的评论数据
          </template>
        </el-alert>
      </el-form>
      <template #footer>
        <el-button @click="addCompetitorDialogVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleConfirmAddCompetitor"
          :loading="isAnalyzing"
        >
          {{ isAnalyzing ? '分析中...' : '开始分析' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

const props = defineProps({
  currentProduct: {
    type: Object,
    required: true
  },
  competitors: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-competitor', 'remove-competitor'])

const isTranslated = ref(false)
const addCompetitorDialogVisible = ref(false)
const isAnalyzing = ref(false)
const newCompetitor = ref({
  asin: ''
})

// 显示的竞品（最多3个）
const displayedCompetitors = computed(() => {
  return props.competitors.slice(0, 3)
})

const hasCompetitors = computed(() => {
  return props.competitors && props.competitors.length > 0
})

// 市场机会分析
const marketOpportunities = computed(() => {
  if (!hasCompetitors.value) return []
  
  const opportunities = []
  
  // 分析价格机会
  const avgCompetitorPrice = props.competitors.reduce((sum, c) => 
    sum + (parseFloat(c.price) || 0), 0) / props.competitors.length
  const currentPrice = parseFloat(props.currentProduct.price) || 0
  
  if (currentPrice < avgCompetitorPrice * 0.8) {
    opportunities.push({
      icon: '💰',
      title: '价格优势明显',
      description: `当前产品价格比竞品平均低${((1 - currentPrice / avgCompetitorPrice) * 100).toFixed(0)}%，可主打性价比`
    })
  }
  
  // 分析评分机会
  const avgCompetitorRating = props.competitors.reduce((sum, c) => 
    sum + (c.rating || 0), 0) / props.competitors.length
  
  if (props.currentProduct.rating > avgCompetitorRating + 0.3) {
    opportunities.push({
      icon: '⭐',
      title: '用户满意度领先',
      description: `当前产品评分比竞品平均高${(props.currentProduct.rating - avgCompetitorRating).toFixed(1)}星，品质优势突出`
    })
  }
  
  // 分析劣势改进机会
  const currentDis = props.currentProduct.disadvantages.map(d => d.en.toLowerCase())
  const competitorAdvSet = new Set()
  props.competitors.forEach(c => {
    c.advantages.forEach(a => competitorAdvSet.add(a.en.toLowerCase()))
  })
  
  const improvementAreas = []
  currentDis.forEach(dis => {
    if (Array.from(competitorAdvSet).some(adv => dis.includes(adv) || adv.includes(dis))) {
      improvementAreas.push(dis)
    }
  })
  
  if (improvementAreas.length > 0) {
    opportunities.push({
      icon: '🔧',
      title: '产品改进方向',
      description: `竞品在"${improvementAreas[0]}"方面表现更好，建议重点优化`
    })
  }
  
  // 默认机会
  if (opportunities.length === 0) {
    opportunities.push({
      icon: '📊',
      title: '持续监控竞品',
      description: '定期更新竞品数据，及时发现市场变化和新机会'
    })
  }
  
  return opportunities
})

// 价格对比
function isPriceBetter(competitorPrice, currentPrice) {
  const cp = parseFloat(competitorPrice) || 0
  const cpp = parseFloat(currentPrice) || 0
  return cp > cpp && cpp > 0
}

// 翻译切换
function handleTranslate() {
  isTranslated.value = !isTranslated.value
}

// 添加竞品
function handleAddCompetitor() {
  newCompetitor.value = { asin: '' }
  addCompetitorDialogVisible.value = true
}

// 确认添加竞品
async function handleConfirmAddCompetitor() {
  if (!newCompetitor.value.asin) {
    ElMessage.warning('请输入竞品ASIN')
    return
  }
  
  // 验证ASIN格式
  const asinRegex = /^B0[0-9A-Z]{8}$/
  if (!asinRegex.test(newCompetitor.value.asin)) {
    ElMessage.warning('ASIN格式不正确，应为10位字符，如：B09FL6YR9L')
    return
  }
  
  isAnalyzing.value = true
  
  try {
    // 触发后端分析
    emit('add-competitor', newCompetitor.value.asin)
    
    ElMessage.success('竞品分析任务已创建，请稍候...')
    addCompetitorDialogVisible.value = false
  } catch (error) {
    ElMessage.error('添加竞品失败：' + error.message)
  } finally {
    isAnalyzing.value = false
  }
}

// 移除竞品
async function removeCompetitor(asin) {
  try {
    await ElMessageBox.confirm('确定移除该竞品？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    emit('remove-competitor', asin)
    ElMessage.success('已移除竞品')
  } catch {
    // 用户取消
  }
}

// 下载
function handleDownload(command) {
  if (command === 'xlsx') {
    exportToXLSX()
  } else {
    exportToPNG()
  }
}

// 导出Excel
function exportToXLSX() {
  const data = [
    ['维度', '当前产品', ...displayedCompetitors.value.map(c => c.name)],
    ['ASIN', props.currentProduct.asin, ...displayedCompetitors.value.map(c => c.asin)],
    ['价格', props.currentProduct.price, ...displayedCompetitors.value.map(c => c.price)],
    ['评分', props.currentProduct.rating, ...displayedCompetitors.value.map(c => c.rating)],
    ['评论数', props.currentProduct.reviewCount, ...displayedCompetitors.value.map(c => c.reviewCount)],
  ]
  
  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '竞品对比')
  
  XLSX.writeFile(wb, `竞品分析-${props.currentProduct.asin}-${new Date().toISOString().slice(0, 10)}.xlsx`)
  ElMessage.success('导出成功！')
}

// 导出PNG
async function exportToPNG() {
  const moduleElement = document.querySelector('.competitor-analysis-module')
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  })
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `竞品分析-${props.currentProduct.asin}-${new Date().toISOString().slice(0, 10)}.png`
    link.click()
    ElMessage.success('图片下载成功！')
  })
}
</script>

<style lang="scss" scoped>
.competitor-analysis-module {
  .comparison-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .header-cell {
    background: white;
    border-radius: 12px;
    padding: 20px;
    border: 2px solid #e5e7eb;
    transition: all 0.2s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    &.product-header {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
    }
  }
  
  .product-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
    
    &.current {
      background: #3b82f6;
      color: white;
    }
    
    &.competitor {
      background: #6b7280;
      color: white;
    }
  }
  
  .product-info {
    display: flex;
    gap: 12px;
  }
  
  .product-thumb {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 8px;
    background: white;
    padding: 4px;
    flex-shrink: 0;
  }
  
  .product-details {
    flex: 1;
    min-width: 0;
  }
  
  .product-name {
    font-weight: 600;
    font-size: 14px;
    color: #111827;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .product-asin {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 8px;
  }
  
  .product-stats {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #374151;
  }
  
  .comparison-body {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  
  .comparison-row {
    display: grid;
    grid-template-columns: 200px repeat(auto-fit, minmax(200px, 1fr));
    border-bottom: 1px solid #f3f4f6;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.highlight-row {
      background: #fafbfc;
    }
  }
  
  .dimension-label {
    padding: 16px 20px;
    font-weight: 600;
    color: #111827;
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
  }
  
  .dimension-value {
    padding: 16px 20px;
    color: #374151;
    display: flex;
    align-items: center;
    border-right: 1px solid #f3f4f6;
    
    &:last-child {
      border-right: none;
    }
    
    &.better {
      background: #f0fdf4;
      color: #15803d;
      font-weight: 600;
    }
    
    &.worse {
      background: #fef2f2;
      color: #991b1b;
    }
    
    &.advantages,
    &.disadvantages {
      flex-wrap: wrap;
      gap: 8px;
    }
  }
  
  .market-opportunities {
    margin-top: 32px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16px;
    }
  }
  
  .opportunities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }
  
  .opportunity-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 20px;
    color: white;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  
  .opportunity-icon {
    font-size: 32px;
    flex-shrink: 0;
  }
  
  .opportunity-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .opportunity-desc {
    font-size: 14px;
    line-height: 1.5;
    opacity: 0.95;
  }
  
  .empty-state {
    padding: 60px 20px;
    text-align: center;
  }
}
</style>


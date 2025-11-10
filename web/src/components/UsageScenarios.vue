<template>
  <div class="module-container usage-scenarios-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">🎯</span>
        <h3 class="module-title">使用场景</h3>
      </div>
      <div class="header-right">
        <el-button size="small" @click="handleTranslate">
          {{ isTranslated ? '还原' : '翻译' }}
        </el-button>
        <el-dropdown @command="handleDownload">
          <el-button size="small">
            下载 <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="csv">📊 下载模块数据</el-dropdown-item>
              <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 说明文字 -->
    <div class="module-description">
      通过分析用户评论，深入挖掘产品的实际使用场景，帮助优化产品定位和营销策略
    </div>

    <!-- 表头 -->
    <div class="table-header">
      <div class="col-desc">使用场景</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip 
          placement="top"
        >
          <template #content>
            <div style="line-height: 1.6;">
              <strong>提及占比计算公式：</strong><br/>
              标签占比 = (标签对应的评论数量 / 总评论数量) × 100%<br/>
              <span style="color: #9CA3AF; font-size: 12px;">
                由于一条评论可能对应多个标签，提及占比之和可能超过100%
              </span>
            </div>
          </template>
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">场景原因</div>
    </div>

    <!-- 数据行 -->
    <div class="scenario-rows">
      <div 
        v-for="(item, index) in displayData" 
        :key="item.desc"
        class="data-row scenario-row"
      >
        <div class="col-desc clickable" @click="openReviewDialog(item)">
          {{ isTranslated ? item.descCn : item.desc }}
          <el-icon class="view-icon"><View /></el-icon>
        </div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ formatPercentage(item.percentage) }}%
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill blue" 
              :style="{ width: Math.min(formatPercentage(item.percentage), 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          <!-- 使用tooltip显示完整内容 -->
          <el-tooltip 
            :content="isTranslated ? (item.reasonCn || item.reason || '暂无说明') : (item.reason || '暂无说明')" 
            placement="top"
            :disabled="!reasonNeedsExpand(item.reason)"
          >
            <div 
              :class="['reason-text', { 'expanded': expandedReasons[index] }]"
              @click="toggleReasonExpand(index)"
            >
              {{ isTranslated ? (item.reasonCn || item.reason || '暂无说明') : (item.reason || '暂无说明') }}
              <span v-if="reasonNeedsExpand(item.reason) && !expandedReasons[index]" class="expand-btn">
                展开
              </span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 加载更多/收起按钮 -->
    <div v-if="showLoadMore || showCollapse" class="load-more-container">
      <el-button v-if="showLoadMore" text @click="loadMore" class="load-more-btn">
        加载更多
      </el-button>
      <el-button v-if="showCollapse" text @click="collapse" class="collapse-btn">
        收起
      </el-button>
    </div>

    <!-- ✅ 原评论弹窗 -->
    <ReviewDialog
      v-model:visible="reviewDialogVisible"
      :keyword="selectedKeyword"
      :reviews="allReviews"
      :title="dialogTitle"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { QuestionFilled, ArrowDown, View } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'
import ReviewDialog from './ReviewDialog.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  productName: {
    type: String,
    default: 'Product'
  },
  // ✅ 新增：所有评论数据（用于原评论弹窗）
  allReviews: {
    type: Array,
    default: () => []
  }
})

const isTranslated = ref(false)
const INITIAL_DISPLAY_COUNT = 10
const LOAD_MORE_COUNT = 10  // 每次加载10条
const currentDisplayCount = ref(INITIAL_DISPLAY_COUNT)

// ✅ 原评论弹窗相关状态
const reviewDialogVisible = ref(false)
const selectedKeyword = ref('')
const dialogTitle = computed(() => {
  return selectedKeyword.value ? `"${selectedKeyword.value}" 相关评论` : '原始评论'
})

// ✅ 原因展开状态
const expandedReasons = ref({})

const displayData = computed(() => {
  return props.data.slice(0, currentDisplayCount.value)
})

const showLoadMore = computed(() => {
  return currentDisplayCount.value < props.data.length
})

const showCollapse = computed(() => {
  return currentDisplayCount.value > INITIAL_DISPLAY_COUNT
})

function handleTranslate() {
  isTranslated.value = !isTranslated.value
}

function loadMore() {
  currentDisplayCount.value = Math.min(
    currentDisplayCount.value + LOAD_MORE_COUNT,
    props.data.length
  )
}

function collapse() {
  currentDisplayCount.value = INITIAL_DISPLAY_COUNT
}

// ✅ 格式化百分比（修复3100%问题）
function formatPercentage(value) {
  if (!value) return 0
  // 如果值已经是百分比形式（>1），直接返回
  if (value > 1) {
    return value.toFixed(1)
  }
  // 如果是小数形式（0-1），转换为百分比
  return (value * 100).toFixed(1)
}

// ✅ 打开原评论弹窗
function openReviewDialog(item) {
  selectedKeyword.value = isTranslated.value ? (item.descCn || item.desc) : item.desc
  reviewDialogVisible.value = true
}

// ✅ 判断原因是否需要展开（超过200字）
function reasonNeedsExpand(reason) {
  return reason && reason.length > 200
}

// ✅ 切换原因展开状态
function toggleReasonExpand(index) {
  expandedReasons.value[index] = !expandedReasons.value[index]
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV()
  } else {
    exportToPNG()
  }
}

function exportToCSV() {
  const headers = ['描述', '占比', '数量', '原因']
  
  const rows = [
    headers,
    ...props.data.map(item => [
      isTranslated.value ? item.descCn : item.desc,
      item.percentage,
      item.count,
      isTranslated.value ? item.reasonCn : item.reason
    ])
  ]
  
  const csvContent = rows.map(row => 
    row.map(cell => {
      const str = String(cell)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(',')
  ).join('\n')
  
  const blob = new Blob(['\uFEFF' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `使用场景-${props.productName}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
}

async function exportToPNG() {
  const moduleElement = document.querySelector('.usage-scenarios-module')
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  })
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `使用场景-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`
    link.click()
  })
}
</script>

<style lang="scss" scoped>
.usage-scenarios-module {
  .table-header {
    grid-template-columns: 15% 20% 65%;
    gap: 16px;
  }

  .scenario-row {
    grid-template-columns: 15% 20% 65%;
    gap: 16px;
    cursor: pointer; // ✅ 添加点击指针
    transition: all 0.2s;
    
    &:hover {
      background: #f0f9ff !important;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
    }
  }

  .col-desc {
    font-weight: 600;
    color: #1F2937;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    // ✅ 可点击样式
    &.clickable {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #3b82f6;
      
      .view-icon {
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      &:hover .view-icon {
        opacity: 1;
      }
    }
  }

  .col-percentage {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .percentage-text {
    font-weight: 600;
    color: #1F2937;
    font-size: 14px;
    min-width: 85px;
  }

  .col-reason {
    color: #4B5563;
    font-size: 13px;
    line-height: 1.6;
    
    .reason-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      position: relative;
      cursor: pointer;
      transition: all 0.3s;
      
      &.expanded {
        display: block;
        -webkit-line-clamp: unset;
        max-height: none;
      }
      
      &:hover {
        color: #1F2937;
      }
      
      .expand-btn {
        display: inline-block;
        margin-left: 8px;
        color: #3b82f6;
        font-weight: 600;
        font-size: 12px;
        cursor: pointer;
        
        &:hover {
          color: #2563eb;
          text-decoration: underline;
        }
      }
    }
  }

  @media (max-width: 1200px) {
    .table-header,
    .scenario-row {
      grid-template-columns: 20% 25% 55%;
    }
  }

  @media (max-width: 768px) {
    .table-header,
    .scenario-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .col-percentage {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .progress-bar-bg {
      width: 100%;
      max-width: 200px;
    }
  }
}
</style>


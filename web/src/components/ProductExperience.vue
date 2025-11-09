<template>
  <div class="module-container product-experience-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">👍</span>
        <h3 class="module-title">产品体验</h3>
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
      通过其他客户的评价，差评分析，以及正向反馈，我们可以洞察用户体验和产品优势
    </div>

    <!-- 负向观点部分 -->
    <div class="section-title negative">【负向观点】</div>
    
    <div class="table-header">
      <div class="col-desc">负向观点</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip placement="top">
          <template #content>
            <div style="line-height: 1.6;">
              <strong>提及占比计算公式：</strong><br/>
              标签占比 = 标签对应的评论数量 / 总评论数量 × 100%<br/>
              <span style="color: #9CA3AF; font-size: 12px;">
                由于一条评论可能对应多个标签，提及占比之和可能超过100%
              </span>
            </div>
          </template>
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">负向原因</div>
    </div>

    <div class="experience-rows">
      <div 
        v-for="(item, index) in negativeDisplay" 
        :key="item.desc"
        class="data-row experience-row"
      >
        <div class="col-desc">{{ isTranslated ? item.descCn : item.desc }}</div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ (item.percentage * 100).toFixed(1) }}%
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill red" 
              :style="{ width: (item.percentage * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          <el-tooltip 
            :content="isTranslated ? item.reasonCn : item.reason" 
            placement="top"
            :disabled="!reasonNeedsExpand(item.reason)"
          >
            <div 
              :class="['reason-text', { 'expanded': expandedNegativeReasons[index] }]"
              @click="toggleNegativeReasonExpand(index)"
            >
              {{ isTranslated ? item.reasonCn : item.reason }}
              <span v-if="reasonNeedsExpand(item.reason) && !expandedNegativeReasons[index]" class="expand-btn">
                展开
              </span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 加载更多/收起按钮（负向） -->
    <div v-if="showNegativeLoadMore || showNegativeCollapse" class="load-more-container">
      <el-button v-if="showNegativeLoadMore" text @click="loadMoreNegative" class="load-more-btn">
        加载更多
      </el-button>
      <el-button v-if="showNegativeCollapse" text @click="collapseNegative" class="collapse-btn">
        收起
      </el-button>
    </div>

    <!-- 正向观点部分 -->
    <div class="section-title positive">【正向观点】</div>
    
    <div class="table-header">
      <div class="col-desc">正向观点</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip placement="top">
          <template #content>
            <div style="line-height: 1.6;">
              <strong>提及占比计算公式：</strong><br/>
              标签占比 = 标签对应的评论数量 / 总评论数量 × 100%<br/>
              <span style="color: #9CA3AF; font-size: 12px;">
                由于一条评论可能对应多个标签，提及占比之和可能超过100%
              </span>
            </div>
          </template>
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">正向原因</div>
    </div>

    <div class="experience-rows">
      <div 
        v-for="(item, index) in positiveDisplay" 
        :key="item.desc"
        class="data-row experience-row"
      >
        <div class="col-desc">{{ isTranslated ? item.descCn : item.desc }}</div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ (item.percentage * 100).toFixed(1) }}%
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill green" 
              :style="{ width: (item.percentage * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          <el-tooltip 
            :content="isTranslated ? item.reasonCn : item.reason" 
            placement="top"
            :disabled="!reasonNeedsExpand(item.reason)"
          >
            <div 
              :class="['reason-text', { 'expanded': expandedPositiveReasons[index] }]"
              @click="togglePositiveReasonExpand(index)"
            >
              {{ isTranslated ? item.reasonCn : item.reason }}
              <span v-if="reasonNeedsExpand(item.reason) && !expandedPositiveReasons[index]" class="expand-btn">
                展开
              </span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 加载更多/收起按钮（正向） -->
    <div v-if="showPositiveLoadMore || showPositiveCollapse" class="load-more-container">
      <el-button v-if="showPositiveLoadMore" text @click="loadMorePositive" class="load-more-btn">
        加载更多
      </el-button>
      <el-button v-if="showPositiveCollapse" text @click="collapsePositive" class="collapse-btn">
        收起
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { QuestionFilled, ArrowDown } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  negativeData: {
    type: Array,
    required: false,  // ✅ 改为非必需
    default: () => []
  },
  positiveData: {
    type: Array,
    required: false,  // ✅ 改为非必需
    default: () => []
  },
  productName: {
    type: String,
    default: 'Product'
  }
})

const isTranslated = ref(false)
const INITIAL_DISPLAY_COUNT = 10
const LOAD_MORE_COUNT = 10  // 每次加载10条
const currentNegativeDisplayCount = ref(INITIAL_DISPLAY_COUNT)
const currentPositiveDisplayCount = ref(INITIAL_DISPLAY_COUNT)

// ✅ 原因展开状态
const expandedNegativeReasons = ref({})
const expandedPositiveReasons = ref({})

const negativeDisplay = computed(() => {
  return props.negativeData.slice(0, currentNegativeDisplayCount.value)
})

const positiveDisplay = computed(() => {
  return props.positiveData.slice(0, currentPositiveDisplayCount.value)
})

const showNegativeLoadMore = computed(() => {
  return currentNegativeDisplayCount.value < props.negativeData.length
})

const showNegativeCollapse = computed(() => {
  return currentNegativeDisplayCount.value > INITIAL_DISPLAY_COUNT
})

const showPositiveLoadMore = computed(() => {
  return currentPositiveDisplayCount.value < props.positiveData.length
})

const showPositiveCollapse = computed(() => {
  return currentPositiveDisplayCount.value > INITIAL_DISPLAY_COUNT
})

function handleTranslate() {
  isTranslated.value = !isTranslated.value
}

// ✅ 判断原因是否需要展开（超过150字）
function reasonNeedsExpand(reason) {
  return reason && reason.length > 150
}

// ✅ 切换原因展开状态
function toggleNegativeReasonExpand(index) {
  expandedNegativeReasons.value[index] = !expandedNegativeReasons.value[index]
}

function togglePositiveReasonExpand(index) {
  expandedPositiveReasons.value[index] = !expandedPositiveReasons.value[index]
}

function loadMoreNegative() {
  currentNegativeDisplayCount.value = Math.min(
    currentNegativeDisplayCount.value + LOAD_MORE_COUNT,
    props.negativeData.length
  )
}

function collapseNegative() {
  currentNegativeDisplayCount.value = INITIAL_DISPLAY_COUNT
}

function loadMorePositive() {
  currentPositiveDisplayCount.value = Math.min(
    currentPositiveDisplayCount.value + LOAD_MORE_COUNT,
    props.positiveData.length
  )
}

function collapsePositive() {
  currentPositiveDisplayCount.value = INITIAL_DISPLAY_COUNT
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV()
  } else {
    exportToPNG()
  }
}

function exportToCSV() {
  const headers = ['类型', '观点描述', '占比', '数量', '原因']
  
  const rows = [
    headers,
    ...props.negativeData.map(item => [
      '负向',
      isTranslated.value ? item.descCn : item.desc,
      item.percentage,
      item.count,
      isTranslated.value ? item.reasonCn : item.reason
    ]),
    ...props.positiveData.map(item => [
      '正向',
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
  link.download = `产品体验-${props.productName}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
}

async function exportToPNG() {
  const moduleElement = document.querySelector('.product-experience-module')
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  })
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `产品体验-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`
    link.click()
  })
}
</script>

<style lang="scss" scoped>
.product-experience-module {
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
  // ✅ 响应式布局
  @media (max-width: 1200px) {
    .table-header,
    .experience-row {
      grid-template-columns: 25% 25% 50% !important;
    }
  }

  @media (max-width: 768px) {
    .table-header,
    .experience-row {
      grid-template-columns: 1fr !important;
      gap: 12px;
    }
    
    .col-percentage {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .section-title {
    padding: 16px 20px 12px;
    font-size: 15px;
    font-weight: 600;
    color: #1F2937;
    background: #F9FAFB;
    border-top: 1px solid #E5E7EB;
    border-bottom: 1px solid #E5E7EB;

    &.negative {
      color: #DC2626;
    }

    &.positive {
      color: #059669;
    }
  }

  .table-header {
    grid-template-columns: 15% 20% 65%;
    gap: 16px;
  }

  .experience-row {
    grid-template-columns: 15% 20% 65%;
    gap: 16px;
  }

  .col-desc {
    font-weight: 600;
    color: #1F2937;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  }

  @media (max-width: 1200px) {
    .table-header,
    .experience-row {
      grid-template-columns: 20% 25% 55%;
    }
  }

  @media (max-width: 768px) {
    .table-header,
    .experience-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    
    .section-title {
      font-size: 14px;
    }
  }
}
</style>


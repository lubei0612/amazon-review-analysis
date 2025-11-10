<template>
  <div class="module-container unmet-needs-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">📋</span>
        <h3 class="module-title">未被满足的需求</h3>
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
      归类统计消费者购买后仍然未被满足的内容
    </div>

    <!-- 表头 -->
    <div class="table-header">
      <div class="col-desc">用户期望</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip 
          placement="top"
        >
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
      <div class="col-reason">期望原因</div>
    </div>

    <!-- 数据行 -->
    <div class="needs-rows">
      <div 
        v-for="item in displayData" 
        :key="item.desc"
        class="data-row needs-row"
      >
        <div class="col-desc">
          {{ isTranslated ? item.descCn : item.desc }}
        </div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ formatPercentage(item.percentage) }}%({{ item.count }})
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill blue" 
              :style="{ width: Math.min(formatPercentage(item.percentage), 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          {{ isTranslated ? (item.reasonCn || item.reason || '暂无说明') : (item.reason || '暂无说明') }}
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { QuestionFilled, ArrowDown } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  data: {
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
const currentDisplayCount = ref(INITIAL_DISPLAY_COUNT)

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

// ✅ 格式化百分比（修复百分比显示过小的问题）
function formatPercentage(value) {
  if (!value) return 0
  // 如果值已经是百分比形式（>1），直接返回
  if (value > 1) {
    return value.toFixed(1)
  }
  // 如果是小数形式（0-1），转换为百分比
  return (value * 100).toFixed(1)
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV()
  } else {
    exportToPNG()
  }
}

function exportToCSV() {
  const headers = ['用户期望', '占比', '数量', '期望原因']
  
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
  link.download = `未被满足的需求-${props.productName}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
}

async function exportToPNG() {
  const moduleElement = document.querySelector('.unmet-needs-module')
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  })
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `未被满足的需求-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`
    link.click()
  })
}
</script>

<style lang="scss" scoped>
.unmet-needs-module {
  // ✅ 响应式布局
  @media (max-width: 1200px) {
    .table-header,
    .need-row {
      grid-template-columns: 30% 25% 45% !important;
    }
  }

  @media (max-width: 768px) {
    .table-header,
    .need-row {
      grid-template-columns: 1fr !important;
      gap: 12px;
    }
  }

  .table-header {
    grid-template-columns: 15% 20% 65%;
    gap: 16px;
  }

  .needs-row {
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
    word-break: break-word;
    overflow-wrap: break-word;
  }

  @media (max-width: 1200px) {
    .table-header,
    .needs-row {
      grid-template-columns: 20% 25% 55%;
    }
  }

  @media (max-width: 768px) {
    .table-header,
    .needs-row {
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


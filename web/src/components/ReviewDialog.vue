<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="true"
    :destroy-on-close="true"
  >
    <div class="review-dialog-content">
      <!-- 搜索关键词提示 -->
      <div v-if="keyword" class="keyword-hint">
        <el-tag type="info" size="large">
          <el-icon><Search /></el-icon>
          搜索关键词: "{{ keyword }}"
        </el-tag>
      </div>

      <!-- 评论列表 -->
      <div v-if="filteredReviews.length > 0" class="reviews-list">
        <div 
          v-for="(review, index) in displayedReviews" 
          :key="review.reviewId || index"
          class="review-item"
        >
          <div class="review-header">
            <div class="review-rating">
              <el-rate 
                v-model="review.rating" 
                disabled 
                show-score
                :colors="['#FF6B6B', '#FFB020', '#67C23A']"
              />
            </div>
            <div class="review-meta">
              <span class="review-author">{{ review.author || '匿名用户' }}</span>
              <span class="review-date">{{ formatDate(review.date) }}</span>
              <el-tag v-if="review.isVerified" type="success" size="small">已验证购买</el-tag>
            </div>
          </div>
          
          <div v-if="review.title" class="review-title">
            {{ review.title }}
          </div>
          
          <div class="review-content">
            <span v-html="highlightKeyword(review.content)"></span>
          </div>
          
          <div class="review-footer">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ review.helpfulVotes || 0 }} 人觉得有用</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <el-empty 
        v-else 
        description="未找到相关评论" 
        :image-size="120"
      />

      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more-section">
        <el-button @click="loadMore" :loading="loading">
          加载更多
        </el-button>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="exportReviews">
        <el-icon><Download /></el-icon>
        导出评论
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Download, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  keyword: {
    type: String,
    default: ''
  },
  reviews: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: '原始评论'
  }
})

const emit = defineEmits(['update:visible', 'close'])

const dialogVisible = ref(false)
const loading = ref(false)
const pageSize = 10
const currentPage = ref(1)

// 监听visible变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (val) {
    currentPage.value = 1
  }
})

// 监听dialogVisible变化
watch(dialogVisible, (val) => {
  emit('update:visible', val)
  if (!val) {
    emit('close')
  }
})

// 对话框标题
const dialogTitle = computed(() => {
  if (props.keyword) {
    return `"${props.keyword}" - 原始评论`
  }
  return props.title
})

// 过滤评论（基于关键词搜索）
const filteredReviews = computed(() => {
  if (!props.keyword) {
    return props.reviews
  }
  
  const keyword = props.keyword.toLowerCase()
  return props.reviews.filter(review => {
    const content = (review.content || '').toLowerCase()
    const title = (review.title || '').toLowerCase()
    return content.includes(keyword) || title.includes(keyword)
  })
})

// 当前显示的评论
const displayedReviews = computed(() => {
  return filteredReviews.value.slice(0, currentPage.value * pageSize)
})

// 是否还有更多
const hasMore = computed(() => {
  return displayedReviews.value.length < filteredReviews.value.length
})

// 加载更多
function loadMore() {
  currentPage.value++
}

// 关闭对话框
function close() {
  dialogVisible.value = false
}

// 高亮关键词
function highlightKeyword(text) {
  if (!props.keyword || !text) return text
  
  const regex = new RegExp(`(${props.keyword})`, 'gi')
  return text.replace(regex, '<mark class="highlight">$1</mark>')
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 导出评论
function exportReviews() {
  if (filteredReviews.value.length === 0) {
    ElMessage.warning('没有可导出的评论')
    return
  }
  
  // 转换为CSV格式
  const headers = ['评分', '作者', '日期', '标题', '内容', '有用投票数']
  const rows = filteredReviews.value.map(review => [
    review.rating,
    review.author || '匿名',
    formatDate(review.date),
    review.title || '',
    review.content || '',
    review.helpfulVotes || 0
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // 下载
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `评论-${props.keyword || '全部'}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  
  ElMessage.success('评论导出成功！')
}
</script>

<style lang="scss" scoped>
.review-dialog-content {
  max-height: 600px;
  overflow-y: auto;
  
  .keyword-hint {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f0f9ff;
    border-radius: 8px;
    margin-bottom: 20px;
    
    .el-tag {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .result-count {
      color: #6b7280;
      font-size: 14px;
    }
  }
  
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .review-item {
    padding: 16px;
    background: #fafbfc;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
    
    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
    }
  }
  
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .review-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    
    .review-author {
      font-weight: 600;
      color: #1f2937;
    }
    
    .review-date {
      color: #6b7280;
      font-size: 13px;
    }
  }
  
  .review-title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
    font-size: 15px;
  }
  
  .review-content {
    color: #374151;
    line-height: 1.6;
    margin-bottom: 12px;
    
    :deep(mark.highlight) {
      background: #fef08a;
      padding: 2px 4px;
      border-radius: 3px;
      font-weight: 600;
    }
  }
  
  .review-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #9ca3af;
    font-size: 13px;
    
    .el-icon {
      font-size: 16px;
    }
  }
  
  .load-more-section {
    text-align: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }
}
</style>


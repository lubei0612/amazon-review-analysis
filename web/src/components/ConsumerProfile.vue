<template>
  <div class="module-container consumer-profile-module">
    <!-- 标题栏 -->
    <div class="module-header">
      <div class="header-left">
        <span class="module-icon">👥</span>
        <h3 class="module-title">消费者画像</h3>
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
              <el-dropdown-item command="xlsx">📊 下载模块数据</el-dropdown-item>
              <el-dropdown-item command="png">🖼️ 下载图片</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 说明文字 -->
    <div class="module-description">
      通过对用户评论的分析，洞察消费者画像、使用习惯和行为特征
    </div>

    <!-- ✅ 消费者画像总结 -->
    <div v-if="summary" class="profile-summary">
      <div class="summary-title">🔍 关键洞察</div>
      <div class="summary-content">
        消费者最常提到的
        <span v-if="summary.topPersona" class="summary-tag persona">人群特征是 <strong>{{ summary.topPersona }}</strong></span><template v-if="summary.topUsageTime">,</template>
        <span v-if="summary.topUsageTime" class="summary-tag time">使用时刻是 <strong>{{ summary.topUsageTime }}</strong></span><template v-if="summary.topLocation">,</template>
        <span v-if="summary.topLocation" class="summary-tag location">使用地点是 <strong>{{ summary.topLocation }}</strong></span><template v-if="summary.topBehavior">,</template>
        <span v-if="summary.topBehavior" class="summary-tag behavior">行为是 <strong>{{ summary.topBehavior }}</strong></span>。
        关注这些热门关键词，挖掘消费者使用场景背后的痛点。
      </div>
    </div>

    <!-- 4个堆叠柱状图 - 一行四列 -->
    <div class="module-body">
      <div class="charts-container-horizontal">
        <!-- Persona 人物角色 -->
        <div class="chart-wrapper-horizontal">
          <div class="chart-title">👤 人物角色</div>
          <v-chart
            class="chart-horizontal"
            :option="getChartOption('persona')"
            autoresize
          />
        </div>

        <!-- Usage Time 使用时刻 -->
        <div class="chart-wrapper-horizontal">
          <div class="chart-title">⏰ 使用时刻</div>
          <v-chart
            class="chart-horizontal"
            :option="getChartOption('usageTime')"
            autoresize
          />
        </div>

        <!-- Usage Location 使用地点 -->
        <div class="chart-wrapper-horizontal">
          <div class="chart-title">📍 使用地点</div>
          <v-chart
            class="chart-horizontal"
            :option="getChartOption('usageLocation')"
            autoresize
          />
        </div>

        <!-- Behavior 行为 -->
        <div class="chart-wrapper-horizontal">
          <div class="chart-title">🎯 行为</div>
          <v-chart
            class="chart-horizontal"
            :option="getChartOption('behavior')"
            autoresize
          />
        </div>
      </div>

      <!-- 提示说明 -->
      <div class="chart-explanation">
        <span class="explanation-text">
          X轴代表评论中提及的话题数量，Y轴代表评论中提及的关键词，
          <span class="positive-label">绿色代表4～5星评论</span>，
          <span class="negative-label">红色代表1～3星评论</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ArrowDown } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  productName: {
    type: String,
    default: 'Product'
  }
})

const isTranslated = ref(false)

// ✅ 计算消费者画像总结（最常提到的Top 1）
const summary = computed(() => {
  if (!props.data) return null
  
  const getTopItem = (dimensionKey) => {
    const items = props.data[dimensionKey] || []
    if (items.length === 0) return null
    
    // 找到总提及数最高的项
    const sorted = [...items].sort((a, b) => {
      const totalA = (a.positiveCount || 0) + (a.negativeCount || 0)
      const totalB = (b.positiveCount || 0) + (b.negativeCount || 0)
      return totalB - totalA
    })
    
    // ✅ 修复：使用keyword而不是label/name
    return sorted[0]?.keyword || sorted[0]?.keywordCn || sorted[0]?.label || sorted[0]?.name || null
  }
  
  return {
    topPersona: getTopItem('persona'),
    topUsageTime: getTopItem('usageTime'),
    topLocation: getTopItem('usageLocation'),
    topBehavior: getTopItem('behavior')
  }
})

// 获取图表配置（垂直柱状图 - 对称式设计）
function getChartOption(dimension) {
  const dimensionData = props.data[dimension] || []
  
  // 按总提及数排序，只取前5名
  const sortedData = [...dimensionData]
    .sort((a, b) => {
      const totalA = (a.positiveCount || 0) + (a.negativeCount || 0)
      const totalB = (b.positiveCount || 0) + (b.negativeCount || 0)
      return totalB - totalA // 降序
    })
    .slice(0, 5) // 只取前5名
  
  // 获取关键词（前5名）
  const keywords = sortedData.map(item => 
    isTranslated.value ? item.keywordCn : item.keyword
  )
  
  // 正向数据（4-5星）- 向上
  const positiveData = sortedData.map(item => item.positiveCount || 0)
  
  // 负向数据（1-3星）- 向下显示为负数
  const negativeData = sortedData.map(item => -(item.negativeCount || 0))
  
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        const keyword = params[0].name
        // params[0] 是绿色正向，params[1] 是红色负向
        const positive = params[0]?.value || 0
        const negative = Math.abs(params[1]?.value || 0) // 取绝对值显示
        const total = positive + negative
        const positivePercent = total > 0 ? ((positive/total)*100).toFixed(1) : 0
        const negativePercent = total > 0 ? ((negative/total)*100).toFixed(1) : 0
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 6px;">${keyword}</div>
            <div style="color: #10B981;">✅ 4～5星: ${positive} (${positivePercent}%)</div>
            <div style="color: #EF4444;">❌ 1～3星: ${negative} (${negativePercent}%)</div>
            <div style="margin-top: 6px; border-top: 1px solid #E5E7EB; padding-top: 6px;">
              总计: ${total}
            </div>
          </div>
        `
      }
    },
    legend: {
      data: ['4～5星评论', '1～3星评论'],
      bottom: 0,
      itemWidth: 16,
      itemHeight: 12,
      textStyle: {
        fontSize: 11
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '12%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: keywords,
      axisLabel: {
        fontSize: 11,
        rotate: 45,
        interval: 0,
        color: '#374151'  // 加深字体颜色，提高可读性
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 11,
        // 显示绝对值（正数）
        formatter: (value) => Math.abs(value)
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#F3F4F6',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '4～5星评论',
        type: 'bar',
        itemStyle: {
          color: '#10B981'
        },
        data: positiveData,
        barWidth: 20,  // 稍微增加柱宽
        barGap: '-100%',  // 关键：让两个柱子完全重叠在同一位置
        label: {
          show: false
        }
      },
      {
        name: '1～3星评论',
        type: 'bar',
        itemStyle: {
          color: '#EF4444'
        },
        data: negativeData, // 使用负数
        barWidth: 20,  // 保持相同宽度
        barGap: '-100%',  // 关键：让两个柱子完全重叠在同一位置
        label: {
          show: false
        }
      }
    ]
  }
}

// 翻译功能
function handleTranslate() {
  isTranslated.value = !isTranslated.value
}

// 下载功能
function handleDownload(command) {
  if (command === 'xlsx') {
    exportToXLSX()
  } else {
    exportToPNG()
  }
}

// 导出XLSX（4个sheet）
function exportToXLSX() {
  const wb = XLSX.utils.book_new()
  
  // 4个维度
  const dimensions = [
    { key: 'persona', name: '人物角色' },
    { key: 'usageTime', name: '使用时刻' },
    { key: 'usageLocation', name: '使用地点' },
    { key: 'behavior', name: '行为' }
  ]
  
  dimensions.forEach(dim => {
    const data = props.data[dim.key] || []
    
    // 表头
    const headers = ['关键词', '正向提及数', '负向提及数', '总提及数', '正向占比']
    
    // 数据行
    const rows = data.map(item => {
      const total = item.positiveCount + item.negativeCount
      return [
        isTranslated.value ? item.keywordCn : item.keyword,
        item.positiveCount,
        item.negativeCount,
        total,
        ((item.positiveCount / total) * 100).toFixed(1) + '%'
      ]
    })
    
    // 创建worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    
    // 设置列宽
    ws['!cols'] = [
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 }
    ]
    
    // 添加到workbook
    XLSX.utils.book_append_sheet(wb, ws, dim.name)
  })
  
  // 下载
  XLSX.writeFile(wb, `消费者画像-${props.productName}-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// 导出PNG
async function exportToPNG() {
  const moduleElement = document.querySelector('.consumer-profile-module')
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  })
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `消费者画像-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`
    link.click()
  })
}
</script>

<style lang="scss" scoped>
.consumer-profile-module {
  // ✅ 消费者画像总结样式
  .profile-summary {
    margin: 20px 24px;
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    
    .summary-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .summary-content {
      font-size: 15px;
      line-height: 1.8;
      color: rgba(255, 255, 255, 0.95);
      
      .summary-tag {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        margin: 0 4px;
        
        strong {
          color: #fff;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  
  .module-body {
    background: #fafbfc;
  }

  .charts-container-horizontal {
    display: grid;
    grid-template-columns: repeat(4, 1fr); // ✅ 默认1行4列
    gap: 24px;
    padding: 24px;

    // ✅ 平板：2列
    @media (max-width: 1400px) {
      grid-template-columns: repeat(2, 1fr);
    }

    // ✅ 手机：1列
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      padding: 16px;
      gap: 16px;
    }
  }

  .chart-wrapper-horizontal {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    min-height: 400px;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .chart-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .chart-horizontal {
      width: 100%;
      flex: 1;
      min-height: 350px;
    }
  }

  .chart-explanation {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 16px 24px;
    margin: 0 24px 24px;
    border-radius: 0 8px 8px 0;

    .explanation-text {
      font-size: 13px;
      line-height: 1.8;
      color: #78350f;

      .positive-label {
        color: #059669;
        font-weight: 600;
        padding: 2px 8px;
        background: #d1fae5;
        border-radius: 4px;
        margin: 0 4px;
      }

      .negative-label {
        color: #dc2626;
        font-weight: 600;
        padding: 2px 8px;
        background: #fee2e2;
        border-radius: 4px;
        margin: 0 4px;
      }
    }
  }
}
</style>


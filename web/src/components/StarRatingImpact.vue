<template>
  <div class="module-container star-rating-impact-module">
    <!-- ✅ 空状态提示 -->
    <div v-if="!props.data || props.data.length === 0" class="empty-state">
      <el-empty description="暂无星级影响度数据">
        <template #image>
          <span style="font-size: 48px">⭐</span>
        </template>
      </el-empty>
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <!-- 标题栏 -->
      <div class="module-header">
        <div class="header-left">
          <span class="module-icon">⭐</span>
          <h3 class="module-title">星级影响度</h3>
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
        分析该商品星级的影响原因，帮助你聚焦问题和机会
      </div>

      <!-- 散点图 -->
      <div class="module-body">
      <div class="chart-container">
        <v-chart
          class="chart"
          :option="chartOption"
          autoresize
        />
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ArrowDown } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'

use([
  CanvasRenderer,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent
])

const props = defineProps({
  data: {
    type: [Array, Object],  // ✅ 支持Array或Object
    required: false,
    default: () => []
  },
  productName: {
    type: String,
    default: 'Product'
  }
})

const isTranslated = ref(false)

// ✅ 获取keyFactors数据（新的数据结构）
const keyFactorsData = computed(() => {
  if (!props.data) return []
  
  // 新数据结构：{ratingDistribution, keyFactors}
  if (props.data.keyFactors && Array.isArray(props.data.keyFactors)) {
    return props.data.keyFactors
  }
  
  // 降级：旧数据结构支持
  if (Array.isArray(props.data)) {
    return props.data
  }
  
  return []
})

// 图表配置 - 散点图（X轴=星级，Y轴=情感倾向）
const chartOption = computed(() => {
  const factors = keyFactorsData.value
  
  if (factors.length === 0) {
    return {}
  }
  
  // ✅ Shulex风格：Y轴使用百分比，数据点按实际占比分散显示
  const positiveData = []
  const negativeData = []
  
  // 按星级分组，用于计算X轴偏移避免重叠
  const ratingGroups = { 1: [], 2: [], 3: [], 4: [], 5: [] }
  
  factors.forEach(item => {
    const rating = item.rating || 3
    ratingGroups[rating].push(item)
  })
  
  // 为每个数据点计算位置
  factors.forEach(item => {
    const factorName = isTranslated.value ? (item.factorEn || item.factor) : item.factor
    const rating = item.rating || 3
    const percentage = (item.percentage || 0) * 100 // 转为百分比（0-100）
    const sentiment = item.sentiment === 'positive' ? 'positive' : 'negative'
    
    // ✅ 计算X轴偏移：同星级的数据点左右分散，避免重叠
    const sameRatingItems = ratingGroups[rating]
    const itemIndex = sameRatingItems.indexOf(item)
    const xOffset = sameRatingItems.length > 1 
      ? ((itemIndex - (sameRatingItems.length - 1) / 2) * 0.12) 
      : 0
    
    const point = {
      value: [
        Number(rating) + xOffset,  // X轴：星级 + 偏移
        percentage  // Y轴：提及占比（0-100%）
      ],
      name: factorName,
      percentage: percentage,
      reason: item.reason || '',
      sentiment: sentiment
    }
    
    if (sentiment === 'positive') {
      positiveData.push(point)
    } else {
      negativeData.push(point)
    }
  })
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const rating = Math.round(params.value[0])
        const sentiment = params.data.sentiment === 'positive' ? '正向' : '负向'
        return `
          <div style="padding: 8px; max-width: 300px;">
            <div style="font-weight: 600; margin-bottom: 6px;">${params.name}</div>
            <div>星级: ${rating}⭐</div>
            <div>情感: ${sentiment}</div>
            <div>提及占比: ${params.data.percentage.toFixed(1)}%</div>
            <div style="margin-top: 6px; color: #6B7280; font-size: 12px; line-height: 1.4;">
              ${params.data.reason}
            </div>
          </div>
        `
      }
    },
    legend: {
      data: ['正向关注点', '负向关注点'],
      bottom: 10,
      itemWidth: 16,
      itemHeight: 12,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '星级',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: 600
      },
      min: 0.5,
      max: 5.5,
      interval: 1,
      axisLabel: {
        formatter: '{value}⭐',
        fontSize: 11,
        color: '#374151'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '提及占比',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: 600
      },
      min: 0,
      max: (value) => {
        // ✅ 动态计算Y轴最大值，稍微大于最大百分比
        return Math.ceil(value.max * 1.15)
      },
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11,
        color: '#374151'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '正向关注点',
        type: 'scatter',
        symbolSize: 10,  // ✅ Shulex风格：较小的散点
        data: positiveData,
        itemStyle: {
          color: '#10B981',
          shadowBlur: 2,
          shadowColor: 'rgba(16, 185, 129, 0.2)'
        },
        label: {
          show: true,  // ✅ Shulex风格：标签默认显示
          position: 'right',
          formatter: '{b}',
          fontSize: 11,
          color: '#059669',
          fontWeight: '500',
          distance: 8,
          backgroundColor: 'transparent'
        },
        emphasis: {
          scale: 1.5,
          itemStyle: {
            color: '#059669',
            shadowBlur: 8,
            shadowColor: 'rgba(16, 185, 129, 0.5)'
          },
          label: {
            fontWeight: '600',
            fontSize: 12
          }
        }
      },
      {
        name: '负向关注点',
        type: 'scatter',
        symbolSize: 10,  // ✅ Shulex风格：较小的散点
        data: negativeData,
        itemStyle: {
          color: '#EF4444',
          shadowBlur: 2,
          shadowColor: 'rgba(239, 68, 68, 0.2)'
        },
        label: {
          show: true,  // ✅ Shulex风格：标签默认显示
          position: 'right',
          formatter: '{b}',
          fontSize: 11,
          color: '#DC2626',
          fontWeight: '500',
          distance: 8,
          backgroundColor: 'transparent'
        },
        emphasis: {
          scale: 1.5,
          itemStyle: {
            color: '#DC2626',
            shadowBlur: 8,
            shadowColor: 'rgba(239, 68, 68, 0.5)'
          },
          label: {
            fontWeight: '600',
            fontSize: 12
          }
        }
      }
    ]
  }
})

function handleTranslate() {
  isTranslated.value = !isTranslated.value
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV()
  } else {
    exportToPNG()
  }
}

function exportToCSV() {
  const headers = ['关注点', '星级', '情感', '提及占比', '原因']
  const factors = keyFactorsData.value
  
  const rows = [
    headers,
    ...factors.map(item => [
      isTranslated.value ? (item.factorEn || item.factor) : item.factor,
      item.rating + '⭐',
      item.sentiment === 'positive' ? '正向' : '负向',
      item.percentage.toFixed(1) + '%',
      item.reason || ''
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
  link.download = `星级影响度-${props.productName}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
}

async function exportToPNG() {
  const moduleElement = document.querySelector('.star-rating-impact-module')
  
  const canvas = await html2canvas(moduleElement, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  })
  
  canvas.toBlob((blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `星级影响度-${props.productName}-${new Date().toISOString().slice(0, 10)}.png`
    link.click()
  })
}
</script>

<style lang="scss" scoped>
.star-rating-impact-module {
  .chart-container {
    padding: 24px;
    background: white;
  }

  .chart {
    width: 100%;
    height: 550px;  /* ✅ Shulex风格：适中高度，更注重宽度展示 */
  }

  @media (max-width: 768px) {
    .chart {
      height: 450px;
    }
  }
}
</style>


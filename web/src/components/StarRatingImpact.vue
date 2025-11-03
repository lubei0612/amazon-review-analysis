<template>
  <div class="module-container star-rating-impact-module">
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
    type: Array,
    required: true
  },
  productName: {
    type: String,
    default: 'Product'
  }
})

const isTranslated = ref(false)

// 图表配置
const chartOption = computed(() => {
  // 分为好评话题和差评话题
  const positiveTopics = []
  const negativeTopics = []
  
  props.data.forEach(item => {
    const point = {
      value: [item.avgRating, item.percentage * 100],
      name: isTranslated.value ? item.topicCn : item.topic,
      itemStyle: {
        color: item.avgRating >= 4 ? '#10B981' : '#EF4444'
      }
    }
    
    if (item.avgRating >= 4) {
      positiveTopics.push(point)
    } else {
      negativeTopics.push(point)
    }
  })
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const data = props.data.find(item => 
          (isTranslated.value ? item.topicCn : item.topic) === params.name
        )
        return `
          <div style="padding: 8px;">
            <div style="font-weight: 600; margin-bottom: 6px;">${params.name}</div>
            <div>平均星级: ${data.avgRating.toFixed(1)} ⭐</div>
            <div>提及占比: ${(data.percentage * 100).toFixed(1)}%</div>
            <div>提及次数: ${data.count}</div>
          </div>
        `
      }
    },
    legend: {
      data: ['好评话题 (≥4星)', '差评话题 (<4星)'],
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
        fontSize: 12,
        color: '#6B7280'
      },
      min: 0,
      max: 5,
      interval: 1,
      axisLabel: {
        formatter: '{value}⭐',
        fontSize: 11
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
      name: '提及占比 (%)',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 12,
        color: '#6B7280'
      },
      axisLabel: {
        formatter: '{value}%',
        fontSize: 11
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
        name: '好评话题 (≥4星)',
        type: 'scatter',
        symbolSize: 10,
        data: positiveTopics,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 11,
          color: '#10B981',
          fontWeight: '500'
        },
        markLine: {
          silent: true,
          symbol: ['none', 'arrow'],
          symbolSize: 8,
          lineStyle: {
            color: '#9CA3AF',
            type: 'solid',
            width: 2
          },
          label: {
            show: false
          },
          data: [
            { xAxis: 4 }
          ]
        }
      },
      {
        name: '差评话题 (<4星)',
        type: 'scatter',
        symbolSize: 10,
        data: negativeTopics,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 11,
          color: '#EF4444',
          fontWeight: '500'
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
  const headers = ['话题', '平均星级', '提及占比', '提及次数']
  
  const rows = [
    headers,
    ...props.data.map(item => [
      isTranslated.value ? item.topicCn : item.topic,
      item.avgRating.toFixed(1),
      (item.percentage * 100).toFixed(1) + '%',
      item.count
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
    height: 500px;
  }

  @media (max-width: 768px) {
    .chart {
      height: 400px;
    }
  }
}
</style>


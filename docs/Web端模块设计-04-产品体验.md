# Web端模块设计 - 产品体验

**模块名称**: 产品体验  
**图标**: 👍  
**版本**: v1.0  
**最后更新**: 2025-10-21

---

## 📋 模块概述

### 功能说明
通过其他客户的评价，差评分析，以及正向反馈，我们可以洞察用户体验和产品优势。将好评和差评整合在一个模块中，方便对比分析。

### 数据展示
- **一个模块**包含两个部分：负向观点 + 正向观点
- 每个部分初始显示TOP 10
- 各自独立的"加载更多"按钮
- 数据占比总和各自=100%

---

## 🎨 UI设计

### 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  👍 产品体验                           翻译  [下载▼]            │
│  通过其他客户的评价，差评分析，以及正向反馈，我们可以洞察用户   │
│  体验和产品优势                                                  │
├─────────────────────────────────────────────────────────────────┤
│  【负向观点】                                                   │
├─────────────────────────────────────────────────────────────────┤
│  负向观点         提及占比 ⓘ                    负向原因         │
├─────────────────────────────────────────────────────────────────┤
│  Poor Sound..  33.1%(2,072) ▓▓▓▓▓▓▓▓░░  Customers have...      │
│  Uncomfortable 23.4%(1,464) ▓▓▓▓▓░░░░░  The headphones...      │
│  Short Batt..  18.1%(1,136) ▓▓▓▓░░░░░░  Users have reported... │
│  ...                                                            │
│  (共显示10条)                                                   │
├─────────────────────────────────────────────────────────────────┤
│                    [加载更多 ▼]                                │
├─────────────────────────────────────────────────────────────────┤
│  【正向观点】                                                   │
├─────────────────────────────────────────────────────────────────┤
│  正向观点         提及占比 ⓘ                    正向原因         │
├─────────────────────────────────────────────────────────────────┤
│  Great Sound.. 49.7%(3,545) ████████████  Customers have...     │
│  Long Battery  18.8%(1,344) ████░░░░░░░  Customers appreciate...│
│  Comfortable   18.8%(1,341) ████░░░░░░░  The headphones...     │
│  ...                                                            │
│  (共显示10条)                                                   │
├─────────────────────────────────────────────────────────────────┤
│                    [加载更多 ▼]                                │
└─────────────────────────────────────────────────────────────────┘
```

**尺寸**:
- 高度：动态（初始约1200px，全部展开约2400px）
- 宽度：100%（响应式）

---

## 🎨 样式配置

### CSS样式

```css
/* 模块容器 */
.product-experience-module {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: white;
  margin-bottom: 24px;
}

/* 标题栏 */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

/* 说明文字 */
.module-description {
  padding: 8px 20px 12px;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

/* 分组标题 */
.section-title {
  padding: 16px 20px 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  background: #F9FAFB;
  border-top: 1px solid #E5E7EB;
  border-bottom: 1px solid #E5E7EB;
}

.section-title.negative {
  color: #DC2626;
}

.section-title.positive {
  color: #059669;
}

/* 表格列头 */
.table-header {
  display: grid;
  grid-template-columns: 15% 20% 65%;
  gap: 16px;
  padding: 12px 20px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

/* 数据行 */
.experience-row {
  display: grid;
  grid-template-columns: 15% 20% 65%;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #F3F4F6;
  align-items: center;
  transition: background 0.2s;
}

.experience-row:hover {
  background: #F9FAFB;
}

/* 描述列 */
.col-desc {
  font-weight: 600;
  color: #1F2937;
  font-size: 14px;
}

/* 占比列 */
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

.progress-bar-bg {
  flex: 1;
  max-width: 100px;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

/* 负向进度条 - 红色 */
.progress-bar-fill.negative {
  height: 100%;
  background: linear-gradient(90deg, #EF4444, #F87171);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 正向进度条 - 绿色 */
.progress-bar-fill.positive {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #34D399);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 原因列 */
.col-reason {
  color: #4B5563;
  font-size: 13px;
  line-height: 1.6;
}

/* 加载更多按钮 */
.load-more-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-bottom: 1px solid #F3F4F6;
}

.load-more-btn {
  padding: 10px 24px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.load-more-btn:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}
```

---

## 📥 下载功能

### CSV导出格式

**文件名**: `产品体验-{产品名称}-{日期}.csv`

**方案1：单文件，类型列区分（推荐）**

```csv
类型,观点描述,占比,数量,原因
负向,Poor Sound Quality,0.331,2072,Customers have reported inconsistent volume, mediocre sound quality, and suppressed midrange in the headphones.
负向,Uncomfortable,0.234,1464,The headphones have been reported to be uncomfortable for users with sensitive ears, too tight, and uncomfortable for extended use.
负向,Short Battery Life,0.181,1136,Users have reported battery failure, short battery life, and inconsistent battery life, with some suspecting that they received a used product.
负向,Stopped Working,0.174,1091,Customers have reported that one side of the headphones stopped working, the headphones stopped working after a short time, or that they received a defective product.
负向,Connection Problems,0.146,914,Customers have experienced unreliable connections, sound synchronization issues, and the headphones disconnecting shortly after connecting.
负向,Charging Issues,0.118,740,Customers have experienced issues with the headphones not charging, not turning on, or breaking after only a short period of use.
负向,Durability Issues,0.065,408,The headphones have been reported to break easily at the hinge, have poor overall durability, and are prone to breaking.
负向,Poor Build Quality,0.059,368,The headphones have been reported to be prone to cracking, not staying on the head properly, and having poor structural quality.
负向,Difficult Controls,0.043,267,Users have reported difficulty turning off the headphones, glitchy volume adjustment, and buttons that don't work properly.
负向,Low Volume,0.040,251,Customers have reported that the speaker is useless as a shower speaker due to low sound output, low volume, and overall poor performance.
正向,Great Sound Quality,0.497,3545,Customers have found the sound quality to be good for their needs, consistent with high-quality sound and volume, providing an enjoyable listening experience.
正向,Long Battery Life,0.188,1344,Customers appreciate the long battery life of these headphones, with a long-lasting battery and impressive battery life, providing extended use without the need for frequent charging.
正向,Comfortable,0.188,1341,The headphones have been reported to be comfortable for watching TV or movies, have a snug fit, and are surprisingly comfortable overall.
正向,Ease Of Use,0.124,886,Customers have reported that the headphones are easy to pair with their iPhone, easy to connect and clean, and convenient for phone use.
正向,High Quality,0.124,881,Customers have found these headphones to have surprising quality, work well, and have good build quality, providing a durable and reliable product.
正向,Good Value For Price,0.078,554,Customers have found these headphones to be worth the price, with a secure fit and good value for headphones with input jacks.
正向,Good Fit,0.074,529,The headphones have been reported to stay securely in the ears, have a good fit over the ears, and have snug earbuds with a good design.
正向,Good Noise Cancellation,0.071,505,Customers have found the noise cancellation to be effective, great, and incredible, blocking out external noise and providing a more immersive listening experience.
正向,Fits Well And Works Well,0.065,466,Users have reported that the headphones fit well and work well, fitting perfectly and being adjustable to their needs.
正向,Great Features,0.058,414,Customers appreciate the additional features such as a carrying pouch, cool charging case, and easy connectivity to Apple devices, making these headphones more convenient to use.
```

**导出实现**:
```javascript
function exportToCSV() {
  const headers = ['类型', '观点描述', '占比', '数量', '原因'];
  
  const rows = [
    headers,
    ...negativeData.map(item => [
      '负向',
      isTranslated ? item.descCn : item.desc,
      item.percentage,
      item.count,
      isTranslated ? item.reasonCn : item.reason
    ]),
    ...positiveData.map(item => [
      '正向',
      isTranslated ? item.descCn : item.desc,
      item.percentage,
      item.count,
      isTranslated ? item.reasonCn : item.reason
    ])
  ];
  
  const csvContent = rows.map(row => row.join(',')).join('\n');
  
  const blob = new Blob(['\uFEFF' + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `产品体验-${productName}-${date}.csv`;
  link.click();
}
```

---

## 🔄 交互功能

### 1. 独立加载更多

```javascript
const [negativeExpanded, setNegativeExpanded] = useState(false);
const [positiveExpanded, setPositiveExpanded] = useState(false);

const negativeDisplay = negativeExpanded 
  ? negativeData 
  : negativeData.slice(0, 10);

const positiveDisplay = positiveExpanded 
  ? positiveData 
  : positiveData.slice(0, 10);

function toggleNegative() {
  setNegativeExpanded(!negativeExpanded);
}

function togglePositive() {
  setPositiveExpanded(!positiveExpanded);
}
```

### 2. 翻译功能

```javascript
const [isTranslated, setIsTranslated] = useState(false);

function handleTranslate() {
  setIsTranslated(!isTranslated);
}

// 显示时根据isTranslated决定显示原文还是译文
const displayDesc = isTranslated ? item.descCn : item.desc;
const displayReason = isTranslated ? item.reasonCn : item.reason;
```

---

## 📊 数据结构

### API响应格式

```json
{
  "productExperience": {
    "negative": [
      {
        "desc": "Poor Sound Quality",
        "descCn": "音质差",
        "percentage": 0.331,
        "count": 2072,
        "reason": "Customers have reported inconsistent volume, mediocre sound quality, and suppressed midrange in the headphones.",
        "reasonCn": "客户反馈音量不稳定、音质一般且中音被压制。"
      },
      {
        "desc": "Uncomfortable",
        "descCn": "不舒适",
        "percentage": 0.234,
        "count": 1464,
        "reason": "The headphones have been reported to be uncomfortable for users with sensitive ears, too tight, and uncomfortable for extended use.",
        "reasonCn": "耳机被反馈对敏感耳朵的用户不舒适、过紧且长时间佩戴不舒服。"
      }
    ],
    "positive": [
      {
        "desc": "Great Sound Quality",
        "descCn": "音质出色",
        "percentage": 0.497,
        "count": 3545,
        "reason": "Customers have found the sound quality to be good for their needs, consistent with high-quality sound and volume, providing an enjoyable listening experience.",
        "reasonCn": "客户发现音质满足其需求，具有高质量的声音和音量，提供愉悦的聆听体验。"
      }
    ]
  }
}
```

---

## 💻 Vue组件实现

```vue
<template>
  <div class="product-experience-module">
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
        <el-tooltip content="该观点在所有差评中被提及的占比" placement="top">
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">负向原因</div>
    </div>

    <div class="experience-rows">
      <div 
        v-for="item in negativeDisplay" 
        :key="item.desc"
        class="experience-row"
      >
        <div class="col-desc">{{ isTranslated ? item.descCn : item.desc }}</div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ (item.percentage * 100).toFixed(1) }}%({{ item.count }})
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill negative" 
              :style="{ width: (item.percentage * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          {{ isTranslated ? item.reasonCn : item.reason }}
        </div>
      </div>
    </div>

    <div v-if="negativeData.length > 10" class="load-more-container">
      <button class="load-more-btn" @click="toggleNegative">
        <span>{{ negativeExpanded ? '收起' : '加载更多' }}</span>
        <span :class="{ expanded: negativeExpanded }">▼</span>
      </button>
    </div>

    <!-- 正向观点部分 -->
    <div class="section-title positive">【正向观点】</div>
    
    <div class="table-header">
      <div class="col-desc">正向观点</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip content="该观点在所有好评中被提及的占比" placement="top">
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">正向原因</div>
    </div>

    <div class="experience-rows">
      <div 
        v-for="item in positiveDisplay" 
        :key="item.desc"
        class="experience-row"
      >
        <div class="col-desc">{{ isTranslated ? item.descCn : item.desc }}</div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ (item.percentage * 100).toFixed(1) }}%({{ item.count }})
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill positive" 
              :style="{ width: (item.percentage * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          {{ isTranslated ? item.reasonCn : item.reason }}
        </div>
      </div>
    </div>

    <div v-if="positiveData.length > 10" class="load-more-container">
      <button class="load-more-btn" @click="togglePositive">
        <span>{{ positiveExpanded ? '收起' : '加载更多' }}</span>
        <span :class="{ expanded: positiveExpanded }">▼</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { QuestionFilled, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  negativeData: Array,
  positiveData: Array
});

const isTranslated = ref(false);
const negativeExpanded = ref(false);
const positiveExpanded = ref(false);

const negativeDisplay = computed(() => {
  return negativeExpanded.value 
    ? props.negativeData 
    : props.negativeData.slice(0, 10);
});

const positiveDisplay = computed(() => {
  return positiveExpanded.value 
    ? props.positiveData 
    : props.positiveData.slice(0, 10);
});

function toggleNegative() {
  negativeExpanded.value = !negativeExpanded.value;
}

function togglePositive() {
  positiveExpanded.value = !positiveExpanded.value;
}

function handleTranslate() {
  isTranslated.value = !isTranslated.value;
}

function handleDownload(command) {
  if (command === 'csv') {
    exportToCSV();
  } else {
    exportToPNG();
  }
}
</script>
```

---

## 📱 响应式设计

```css
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
```

---

## 🎯 使用场景

### 对比分析
- 快速对比产品的优势和劣势
- 识别需要改进的关键问题
- 发现可强化的核心卖点

### 产品优化
- 根据负向观点改进产品
- 根据正向观点强化Listing

### 竞品对比
- 与竞品的优缺点对比
- 找到差异化优势

---

**文档维护人**: 即贸技术团队  
**组件路径**: `src/components/ProductExperience.vue`


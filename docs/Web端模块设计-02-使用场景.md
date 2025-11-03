# Web端模块设计 - 使用场景

**模块名称**: 使用场景  
**图标**: 🎯  
**版本**: v1.0  
**最后更新**: 2025-10-21

---

## 📋 模块概述

### 功能说明
挖掘消费者真实使用场景（Workouts、Music、Gym Use等），发现潜在合作伙伴市场和新的应用场景。

### 数据展示
- 显示**所有**使用场景（20-30条）
- 初始显示TOP 10，点击"展开更多"查看全部
- 数据占比总和=100%
- 每条数据包含：描述、占比+数量、进度条、原因

---

## 🎨 UI设计

### 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 使用场景                           翻译  [下载▼]            │
│  挖掘消费者真实使用场景，发现潜在合作伙伴市场                    │
├─────────────────────────────────────────────────────────────────┤
│  使用场景        提及占比 ⓘ                    原因             │
├─────────────────────────────────────────────────────────────────┤
│  Workouts    21.5%(359) ████████░░  Customers have found...    │
├─────────────────────────────────────────────────────────────────┤
│  Music       15.7%(262) ██████░░░░  Customers have found...    │
├─────────────────────────────────────────────────────────────────┤
│  Gym Use     12.3%(205) █████░░░░░  Customers have found...    │
├─────────────────────────────────────────────────────────────────┤
│  ...                                                            │
│  (共显示10条)                                                   │
├─────────────────────────────────────────────────────────────────┤
│                    [展开更多 ▼]                                │
└─────────────────────────────────────────────────────────────────┘
```

**尺寸**:
- 高度：动态（10条约600px，全部展开约1200px）
- 宽度：100%（响应式）
- 单行高度：约60px

---

## 📊 表格列设计

### 列宽比例

| 列名 | 宽度 | 说明 |
|------|------|------|
| 使用场景 | 15% | 固定宽度，关键词 |
| 提及占比 | 20% | 百分比+进度条 |
| 原因 | 65% | 自动填充，完整显示 |

### 单行结构

```html
<div class="scenario-row">
  <div class="col-desc">Workouts</div>
  <div class="col-percentage">
    <span class="percentage-text">21.5%(359)</span>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" style="width: 21.5%"></div>
    </div>
  </div>
  <div class="col-reason">
    Customers have found these headphones to be great for workouts, exercise, and work calls during workouts.
  </div>
</div>
```

---

## 🎨 样式配置

### CSS样式

```css
/* 模块容器 */
.usage-scenario-module {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-icon {
  font-size: 20px;
}

.module-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* 说明文字 */
.module-description {
  padding: 8px 20px 12px;
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
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

.tooltip-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 4px;
  color: #9CA3AF;
  cursor: help;
  font-size: 12px;
}

/* 数据行 */
.scenario-row {
  display: grid;
  grid-template-columns: 15% 20% 65%;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid #F3F4F6;
  align-items: center;
  transition: background 0.2s;
}

.scenario-row:hover {
  background: #F9FAFB;
}

.scenario-row:last-child {
  border-bottom: none;
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

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #60A5FA);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 原因列 */
.col-reason {
  color: #4B5563;
  font-size: 13px;
  line-height: 1.6;
  /* 不截断，完整显示 */
}

/* 展开按钮 */
.expand-btn-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-top: 1px solid #F3F4F6;
}

.expand-btn {
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

.expand-btn:hover {
  background: #F3F4F6;
  border-color: #9CA3AF;
}

.expand-icon {
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}
```

---

## 📥 下载功能

### 下载菜单

```html
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
```

### CSV导出格式

**文件名**: `使用场景-{产品名称}-{日期}.csv`

**CSV结构**:
```csv
描述,占比,数量,原因
Workouts,0.2147129,359,Customers have found these headphones to be great for workouts, exercise, and work calls during workouts.
Music,0.1566986,262,Customers have found these headphones to be great for listening to music, playing video games, and listening to audio on their computers.
Gym Use,0.1226077,205,Customers have found these headphones to be useful for gym use, walking, and other exercise activities, with noise cancelling capabilities and safety features.
Microphone,0.0950957,159,Customers have appreciated the microphone for conferencing and phone calls, with good voice clarity and Bluetooth range.
```

**导出实现**:
```javascript
function exportToCSV() {
  const csvContent = [
    ['描述', '占比', '数量', '原因'],
    ...data.map(item => [
      item.desc,
      item.percentage,
      item.count,
      item.reason
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `使用场景-${productName}-${date}.csv`;
  link.click();
}
```

### 图片导出

- 格式：PNG
- 尺寸：1920x800px（根据展开状态动态调整）
- 内容：整个表格的截图
- 使用`html2canvas`库

```javascript
import html2canvas from 'html2canvas';

async function exportToPNG() {
  const element = document.querySelector('.usage-scenario-module');
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2 // 高清截图
  });
  
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `使用场景-${productName}-${date}.png`;
  link.click();
}
```

---

## 🔄 交互功能

### 1. 展开/收起

```javascript
const [isExpanded, setIsExpanded] = useState(false);
const displayData = isExpanded ? allData : allData.slice(0, 10);

function toggleExpand() {
  setIsExpanded(!isExpanded);
}
```

### 2. 翻译功能

```javascript
const [isTranslated, setIsTranslated] = useState(false);

const handleTranslate = async () => {
  if (!isTranslated) {
    // 翻译原因列
    const translatedData = await Promise.all(
      data.map(async item => ({
        ...item,
        reason: await translateText(item.reason, 'zh-CN')
      }))
    );
    setData(translatedData);
  } else {
    // 恢复原文
    setData(originalData);
  }
  setIsTranslated(!isTranslated);
};
```

**翻译示例**:
- 原文: `Customers have found these headphones to be great for workouts...`
- 译文: `客户发现这些耳机非常适合锻炼、运动和通话期间使用。`

### 3. Tooltip提示

```html
<el-tooltip content="该场景在所有评论中被提及的占比" placement="top">
  <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
</el-tooltip>
```

---

## 📊 数据结构

### API响应格式

```json
{
  "usageScenarios": [
    {
      "desc": "Workouts",
      "descCn": "锻炼",
      "percentage": 0.2147129,
      "count": 359,
      "reason": "Customers have found these headphones to be great for workouts, exercise, and work calls during workouts.",
      "reasonCn": "客户发现这些耳机非常适合锻炼、运动和通话期间使用。"
    },
    {
      "desc": "Music",
      "descCn": "音乐",
      "percentage": 0.1566986,
      "count": 262,
      "reason": "Customers have found these headphones to be great for listening to music, playing video games, and listening to audio on their computers.",
      "reasonCn": "客户发现这些耳机非常适合听音乐、玩视频游戏和在电脑上听音频。"
    }
  ]
}
```

---

## 💻 Vue组件实现

```vue
<template>
  <div class="usage-scenario-module">
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
      挖掘消费者真实使用场景，发现潜在合作伙伴市场
    </div>

    <!-- 表格列头 -->
    <div class="table-header">
      <div class="col-desc">使用场景</div>
      <div class="col-percentage">
        提及占比
        <el-tooltip content="该场景在所有评论中被提及的占比" placement="top">
          <el-icon class="tooltip-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="col-reason">原因</div>
    </div>

    <!-- 数据行 -->
    <div class="scenario-rows">
      <div 
        v-for="item in displayData" 
        :key="item.desc"
        class="scenario-row"
      >
        <div class="col-desc">{{ item.desc }}</div>
        <div class="col-percentage">
          <span class="percentage-text">
            {{ (item.percentage * 100).toFixed(1) }}%({{ item.count }})
          </span>
          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ width: (item.percentage * 100) + '%' }"
            ></div>
          </div>
        </div>
        <div class="col-reason">
          {{ isTranslated ? item.reasonCn : item.reason }}
        </div>
      </div>
    </div>

    <!-- 展开按钮 -->
    <div v-if="data.length > 10" class="expand-btn-container">
      <button class="expand-btn" @click="toggleExpand">
        <span>{{ isExpanded ? '收起' : '展开更多' }}</span>
        <span class="expand-icon" :class="{ expanded: isExpanded }">▼</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { QuestionFilled, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const isExpanded = ref(false);
const isTranslated = ref(false);

const displayData = computed(() => {
  return isExpanded.value ? props.data : props.data.slice(0, 10);
});

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
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

function exportToCSV() {
  // CSV导出逻辑
}

function exportToPNG() {
  // PNG导出逻辑
}
</script>
```

---

## 📱 响应式设计

```css
@media (max-width: 1200px) {
  .table-header,
  .scenario-row {
    grid-template-columns: 20% 25% 55%;
  }
  
  .col-reason {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .table-header,
  .scenario-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .col-percentage {
    justify-content: flex-start;
  }
  
  .progress-bar-bg {
    max-width: 200px;
  }
}
```

---

## 🎯 性能优化

1. **虚拟滚动**（数据超过50条时）:
```javascript
import { useVirtualList } from '@vueuse/core';

const { list, containerProps, wrapperProps } = useVirtualList(
  data,
  { itemHeight: 60 }
);
```

2. **懒加载翻译**:
```javascript
// 只翻译当前可见的10条
const visibleData = displayData.slice(0, 10);
await translateBatch(visibleData);
```

---

**文档维护人**: 即贸技术团队  
**组件路径**: `src/components/UsageScenario.vue`


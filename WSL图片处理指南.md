# 📸 WSL环境下的图片处理指南

## 🎯 目标
在WSL中使用Droid时，能够方便地将图片发送给AI助手

---

## ✅ 方案1: 直接粘贴（最简单）⭐⭐⭐⭐⭐

如果你是通过**浏览器**访问Droid（https://app.factory.ai），这个方法最简单：

### 步骤：
1. **在Windows中截图**：
   - 按 `Win + Shift + S`（Windows截图工具）
   - 或使用任何截图工具（QQ截图、微信截图等）
   
2. **直接粘贴到对话框**：
   - 在浏览器的Droid对话框中按 `Ctrl + V`
   - 图片会直接显示在输入框中
   - 按回车发送

**这种方式不需要保存文件，最方便！**

---

## ✅ 方案2: Windows截图自动保存 ⭐⭐⭐⭐

Windows可以设置截图自动保存到指定文件夹，WSL可以直接访问。

### 步骤：

#### 1. 创建截图文件夹
在Windows中创建：
```
D:\Users\Desktop\maijiaplug\screenshots\
```

#### 2. 配置Windows截图工具
- 按 `Win + Shift + S` 截图后
- 点击右下角的通知
- 点击"保存"按钮
- 选择保存到 `D:\Users\Desktop\maijiaplug\screenshots\`

#### 3. 在WSL中访问
```bash
# WSL中可以直接访问
cd /mnt/d/Users/Desktop/maijiaplug/screenshots/
ls -lh  # 查看最新的截图

# 如果需要，可以创建一个快捷命令
echo 'alias ss="cd /mnt/d/Users/Desktop/maijiaplug/screenshots && ls -lht | head -5"' >> ~/.bashrc
source ~/.bashrc

# 以后直接运行
ss  # 查看最新的5个截图
```

#### 4. 发送图片
在Droid对话框中，可以：
- **拖拽图片**：从Windows文件管理器拖到浏览器对话框
- **复制粘贴**：在文件管理器中复制图片，在对话框中粘贴
- **使用路径**：直接告诉我路径，我可以读取

---

## ✅ 方案3: 使用ShareX（推荐给高级用户）⭐⭐⭐⭐⭐

ShareX是一个免费的Windows截图工具，功能强大。

### 安装：
```
下载地址: https://getsharex.com/
或通过 winget: winget install ShareX.ShareX
```

### 配置自动保存：

1. **设置截图快捷键**：
   - 打开ShareX
   - Hotkey settings → Capture region → 设置为 `F1`（或你喜欢的键）

2. **设置自动保存路径**：
   - Application settings → Paths
   - Screenshots folder: `D:\Users\Desktop\maijiaplug\screenshots`
   - File naming: `{y}-{mo}-{d}_{h}-{mi}-{s}`

3. **设置自动上传到剪贴板**：
   - Task settings → After capture → Copy image to clipboard

### 使用：
```
按F1 → 截图 → 自动保存到指定文件夹 + 复制到剪贴板
→ 在Droid对话框中 Ctrl+V 粘贴
```

**优势**：
- 一键截图
- 自动保存文件（WSL可访问）
- 自动复制到剪贴板（可直接粘贴）
- 支持各种截图模式（全屏、窗口、区域等）

---

## ✅ 方案4: 使用Windows Terminal的图片支持 ⭐⭐⭐

如果你使用Windows Terminal运行WSL，它支持直接显示图片。

### 安装imgcat（可选）：
```bash
# 在WSL中安装
sudo apt update
sudo apt install imagemagick

# 创建一个简单的图片查看别名
echo 'alias imgcat="wslview"' >> ~/.bashrc
source ~/.bashrc
```

### 使用wslview打开图片：
```bash
# 查看Windows中的图片
wslview /mnt/d/Users/Desktop/maijiaplug/screenshots/screenshot.png

# 这会在Windows默认图片查看器中打开
# 然后你可以复制图片，粘贴到Droid对话框
```

---

## ✅ 方案5: 快速命令脚本 ⭐⭐⭐⭐

创建一个脚本来快速处理截图。

### 创建脚本：
```bash
# 在WSL中创建
cat > ~/bin/latest-screenshot.sh << 'EOF'
#!/bin/bash
# 获取最新的截图文件

SCREENSHOT_DIR="/mnt/d/Users/Desktop/maijiaplug/screenshots"

if [ ! -d "$SCREENSHOT_DIR" ]; then
    echo "截图目录不存在: $SCREENSHOT_DIR"
    exit 1
fi

# 获取最新的图片文件
LATEST=$(ls -t "$SCREENSHOT_DIR"/*.{png,jpg,jpeg} 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
    echo "没有找到截图文件"
    exit 1
fi

echo "最新截图: $LATEST"
echo "文件大小: $(du -h "$LATEST" | cut -f1)"
echo "修改时间: $(stat -c %y "$LATEST" | cut -d'.' -f1)"

# 选项：用Windows默认程序打开
if [ "$1" = "open" ]; then
    wslview "$LATEST"
fi

# 选项：显示完整路径
if [ "$1" = "path" ]; then
    echo "$LATEST"
fi
EOF

chmod +x ~/bin/latest-screenshot.sh

# 创建别名
echo 'alias latest="~/bin/latest-screenshot.sh"' >> ~/.bashrc
source ~/.bashrc
```

### 使用：
```bash
# 查看最新截图信息
latest

# 打开最新截图
latest open

# 获取路径（可以告诉AI）
latest path
```

---

## 🎯 推荐工作流程

### 最简单的流程（推荐）：

1. **在Windows中截图**（Win + Shift + S）
2. **在浏览器的Droid对话框中粘贴**（Ctrl + V）
3. **发送**

**无需任何配置，立即可用！**

---

### 进阶工作流程（需要频繁截图）：

1. **安装ShareX** 
2. **设置自动保存到项目目录**
3. **在WSL中使用Droid CLI**
4. **需要发送图片时**：
   - Windows中截图（F1）
   - 浏览器中打开Droid web界面
   - 粘贴图片（Ctrl + V）

---

## 💡 实用技巧

### 技巧1: 创建符号链接
```bash
# 在WSL home目录创建快捷方式
ln -s /mnt/d/Users/Desktop/maijiaplug/screenshots ~/screenshots

# 快速访问
cd ~/screenshots
```

### 技巧2: 监控截图文件夹
```bash
# 实时监控新截图
watch -n 1 'ls -lht /mnt/d/Users/Desktop/maijiaplug/screenshots | head -5'
```

### 技巧3: 快速查看最新截图
```bash
# 添加到 ~/.bashrc
function ss() {
    local dir="/mnt/d/Users/Desktop/maijiaplug/screenshots"
    echo "最新的5个截图:"
    ls -lht "$dir"/*.{png,jpg,jpeg} 2>/dev/null | head -5
}
```

---

## 📝 常见问题

### Q: 我在WSL终端中运行droid，能发送图片吗？
A: WSL终端本身不支持图片显示。建议：
- 使用浏览器访问 https://app.factory.ai （支持图片粘贴）
- 或者用文字描述问题（很多时候文字就够了）

### Q: 我必须用CLI吗？
A: 不必须。浏览器版本的Droid体验更好，支持：
- 直接粘贴图片
- 更好的排版
- 代码高亮
- 实时预览

### Q: WSL可以访问Windows剪贴板吗？
A: WSL2支持剪贴板共享，但仅限于文本。图片需要通过文件系统共享。

### Q: 如何快速打开项目目录？
```bash
# 在WSL中
explorer.exe /mnt/d/Users/Desktop/maijiaplug/screenshots

# 或者
wslview /mnt/d/Users/Desktop/maijiaplug/screenshots
```

---

## 🎉 总结

**最推荐的方式**：
1. 在Windows中截图（Win + Shift + S）
2. 在浏览器中使用Droid（https://app.factory.ai）
3. 直接粘贴图片（Ctrl + V）

**这种方式**：
- ✅ 无需配置
- ✅ 最快速
- ✅ 支持所有图片格式
- ✅ 不占用磁盘空间（临时截图）

**如果需要保存截图**：
- 使用ShareX自动保存到项目目录
- WSL可以通过 /mnt 路径访问

---

**现在就试试吧！** 📸

按 Win + Shift + S 截个图，然后在这个对话框粘贴看看！

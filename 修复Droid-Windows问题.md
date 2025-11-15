# 🔧 修复 Droid 在 Windows 11 上卡住的问题

## 问题描述
- **系统**: Windows 11
- **环境**: 使用VPN
- **现象**: 运行 `droid` 命令后卡住，没有任何响应

---

## ✅ 解决方案（按优先级排序）

### 方案1: VPN导致的连接问题（最可能）⭐⭐⭐⭐⭐

VPN可能导致Droid无法连接到Factory服务器。

**解决步骤**:

#### 步骤1: 临时关闭VPN测试
```powershell
# 1. 断开VPN连接
# 2. 打开PowerShell
# 3. 运行
droid
```

如果这样可以工作，说明是VPN问题。

#### 步骤2: 配置VPN分流（推荐）

如果必须使用VPN，配置VPN让Droid相关域名不走代理：

**需要排除的域名**:
```
*.factory.ai
*.openai.com
*.anthropic.com
api.factory.ai
app.factory.ai
```

**Clash配置示例**:
```yaml
rules:
  - DOMAIN-SUFFIX,factory.ai,DIRECT
  - DOMAIN-SUFFIX,openai.com,DIRECT
  - DOMAIN-SUFFIX,anthropic.com,DIRECT
```

#### 步骤3: 配置系统代理绕过

Windows设置 → 网络和Internet → 代理 → 手动代理设置：

在"不使用代理服务器的地址"中添加：
```
*.factory.ai;*.openai.com;*.anthropic.com;localhost;127.0.0.1
```

---

### 方案2: PowerShell执行策略问题⭐⭐⭐⭐

Windows 11的PowerShell可能阻止了Droid的脚本执行。

**解决步骤**:

```powershell
# 以管理员身份运行PowerShell
# 方法：右键开始菜单 → Windows PowerShell (管理员)

# 检查当前执行策略
Get-ExecutionPolicy

# 如果是 Restricted，设置为 RemoteSigned
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 确认更改
Y

# 重新运行droid
droid
```

---

### 方案3: 防火墙阻止⭐⭐⭐⭐

Windows Defender防火墙可能阻止了Droid的网络访问。

**解决步骤**:

```powershell
# 方法1: 临时关闭防火墙测试（不推荐长期使用）
# Windows设置 → 隐私和安全性 → Windows安全中心 → 防火墙和网络保护
# 关闭"专用网络"的防火墙

# 方法2: 添加防火墙规则（推荐）
# 以管理员身份运行PowerShell：

# 允许Droid出站连接
New-NetFirewallRule -DisplayName "Droid Factory" -Direction Outbound -Action Allow -Program "C:\Users\你的用户名\AppData\Local\Programs\droid\droid.exe"

# 允许Node.js（Droid可能使用）
New-NetFirewallRule -DisplayName "Node.js for Droid" -Direction Outbound -Action Allow -Program "C:\Program Files\nodejs\node.exe"
```

---

### 方案4: 清除Droid缓存和配置⭐⭐⭐

损坏的配置文件可能导致卡住。

**解决步骤**:

```powershell
# 1. 关闭所有Droid进程
taskkill /F /IM droid.exe

# 2. 删除Droid配置目录
Remove-Item -Recurse -Force "$env:USERPROFILE\.factory"
Remove-Item -Recurse -Force "$env:USERPROFILE\.droid"

# 3. 清除npm缓存（如果使用npm安装）
npm cache clean --force

# 4. 重新运行droid
droid
```

---

### 方案5: DNS问题⭐⭐⭐

VPN可能导致DNS解析失败。

**解决步骤**:

```powershell
# 清除DNS缓存
ipconfig /flushdns

# 设置备用DNS（使用Google DNS）
# Windows设置 → 网络和Internet → 以太网/Wi-Fi → DNS服务器分配
# 首选DNS: 8.8.8.8
# 备用DNS: 8.8.4.4

# 或使用命令行
netsh interface ip set dns "以太网" static 8.8.8.8
netsh interface ip add dns "以太网" 8.8.4.4 index=2
```

---

### 方案6: 使用调试模式查看具体错误⭐⭐

运行Droid时启用详细日志。

**解决步骤**:

```powershell
# 设置环境变量启用调试
$env:DEBUG="*"
droid

# 或者查看Droid日志文件
Get-Content "$env:USERPROFILE\.factory\logs\droid.log" -Tail 50
```

---

### 方案7: 检查端口占用⭐⭐

某些端口可能被占用。

**解决步骤**:

```powershell
# 检查常用端口
netstat -ano | findstr "LISTENING" | findstr ":3000 :8080 :9000"

# 如果发现占用，终止进程
# 找到PID后
taskkill /F /PID <进程ID>
```

---

### 方案8: 重新安装Droid⭐

完全卸载后重新安装。

**解决步骤**:

```powershell
# 1. 卸载Droid
npm uninstall -g @factory/droid

# 或者如果使用安装包，在"添加或删除程序"中卸载

# 2. 删除残留文件
Remove-Item -Recurse -Force "$env:USERPROFILE\.factory"
Remove-Item -Recurse -Force "$env:USERPROFILE\.droid"
Remove-Item -Recurse -Force "$env:APPDATA\npm\droid*"

# 3. 重新安装
npm install -g @factory/droid

# 或下载最新安装包重新安装
```

---

## 🔍 诊断脚本

创建一个PowerShell脚本来诊断问题：

```powershell
# 保存为 diagnose-droid.ps1

Write-Host "=== Droid 诊断脚本 ===" -ForegroundColor Green
Write-Host ""

# 检查网络连接
Write-Host "1. 检查网络连接..." -ForegroundColor Yellow
Test-NetConnection -ComputerName factory.ai -Port 443

# 检查DNS解析
Write-Host "2. 检查DNS解析..." -ForegroundColor Yellow
Resolve-DnsName factory.ai

# 检查代理设置
Write-Host "3. 检查代理设置..." -ForegroundColor Yellow
Get-ItemProperty -Path "Registry::HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" | Select-Object ProxyEnable, ProxyServer

# 检查执行策略
Write-Host "4. 检查PowerShell执行策略..." -ForegroundColor Yellow
Get-ExecutionPolicy

# 检查Droid安装
Write-Host "5. 检查Droid安装..." -ForegroundColor Yellow
Get-Command droid -ErrorAction SilentlyContinue

# 检查Node.js
Write-Host "6. 检查Node.js..." -ForegroundColor Yellow
node --version

# 检查防火墙规则
Write-Host "7. 检查防火墙规则..." -ForegroundColor Yellow
Get-NetFirewallRule -DisplayName "*droid*"

Write-Host ""
Write-Host "=== 诊断完成 ===" -ForegroundColor Green
```

运行诊断：
```powershell
# 允许脚本执行
Set-ExecutionPolicy RemoteSigned -Scope Process
# 运行诊断
.\diagnose-droid.ps1
```

---

## 🎯 推荐的解决流程

### 快速测试流程（5分钟）:

```powershell
# 1. 断开VPN
# 2. 以管理员运行PowerShell
# 3. 执行
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
ipconfig /flushdns
droid
```

如果这样可以工作，说明是VPN+执行策略的问题。

### 完整解决流程（15分钟）:

1. **断开VPN测试** → 如果可以工作，配置VPN分流
2. **设置执行策略** → RemoteSigned
3. **清除缓存** → 删除 .factory 目录
4. **配置DNS** → 8.8.8.8
5. **添加防火墙规则** → 允许Droid出站
6. **重新连接VPN** → 测试是否正常

---

## 💡 最佳实践

如果经常遇到VPN问题，建议：

### 选项A: 使用WSL（你当前方案）
- ✅ 绕过Windows防火墙和VPN问题
- ✅ 性能更好
- ❌ 图片上传稍微麻烦（但可以解决）

### 选项B: 配置好的Windows环境
- ✅ 图片上传方便
- ✅ 原生体验
- ❌ 需要配置VPN分流

### WSL图片上传解决方案

在WSL中访问Windows文件系统：

```bash
# Windows的C盘
cd /mnt/c/Users/你的用户名/Pictures

# 或者在Windows中将图片保存到项目目录
# WSL可以直接访问：
cd /mnt/d/Users/Desktop/maijiaplug/screenshots
```

---

## 📞 如果还是不行

请提供以下信息：

1. **运行诊断脚本的输出**
2. **VPN类型**（Clash、V2Ray、公司VPN等）
3. **具体卡住的表现**：
   - 有光标闪烁吗？
   - 按Ctrl+C能否退出？
   - 任务管理器中能看到droid进程吗？
4. **Droid版本**: 运行 `droid --version`（如果能运行的话）

---

## 🎉 成功后的验证

```powershell
# 运行droid
droid

# 应该看到类似输出：
# > Droid CLI v2.x.x
# > Connected to Factory
# > Ready to work!
```

---

**最后建议**: 根据你的情况（使用VPN + Windows 11），**80%的可能性是VPN导致的**。

先试试断开VPN运行，如果成功，再配置VPN分流规则。

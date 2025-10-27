# 牛子小助手

一个基于Docker的个人健康记录小程序，使用React + Node.js + PostgreSQL构建。

## 技术栈

- **前端**: React + TypeScript + Ant Design
- **后端**: Node.js + Express + TypeScript
- **数据库**: PostgreSQL
- **认证**: JWT令牌
- **容器化**: Docker + Docker Compose

## 功能特性

- 🔐 用户注册和登录
- ⏱️ 计时记录功能
- 📅 日历打卡视图
- 📊 数据统计分析
- 🏆 成就系统（25项成就）
- 📱 响应式设计

## 快速开始

### 本地部署

#### 前置要求

- Docker Desktop
- Docker Compose

#### 启动项目

```bash
# 克隆项目
git clone https://github.com/your-username/niuzi-assistant.git

# 进入项目目录
cd niuzi-assistant

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

访问地址：

- 前端: http://localhost:6688
- 后端API: http://localhost:3001/api

#### 停止项目

```bash
docker-compose down
```

#### 清理数据

```bash
docker-compose down -v
```

### 群晖 NAS 部署

#### 前置要求

- 群晖 NAS（已安装 Docker）
- SSH 访问权限

#### 部署步骤

1. **SSH 登录群晖**

```bash
ssh admin@your-nas-ip
sudo -i
```

2. **创建项目目录**

```bash
mkdir -p /volume2/docker/niuzi-assistant
cd /volume2/docker/niuzi-assistant
```

3. **上传项目文件**

可以使用以下方式之一：

- **方式1：使用 git clone**
```bash
git clone https://github.com/your-username/niuzi-assistant.git .
```

- **方式2：使用 File Station 上传**
  - 在群晖 DSM 中打开 File Station
  - 导航到 `/volume2/docker/` 目录
  - 上传项目压缩包并解压到 `niuzi-assistant` 文件夹

4. **配置数据存储路径**

编辑 `docker-compose.yml` 文件中的数据卷映射路径：

```yaml
volumes:
  # 数据库数据
  - /volume2/docker/niuzi-assistant/data/postgresql:/data/postgresql
  # 后端数据
  - /volume2/docker/niuzi-assistant/data/backend:/data/backend
  # 备份数据
  - /volume2/docker/niuzi-assistant/data/backups:/data/backups
  # 前端日志
  - /volume2/docker/niuzi-assistant/data/frontend/logs:/data/logs
  # 上传文件
  - /volume2/docker/niuzi-assistant/data/uploads:/data/uploads
```

**重要提示**：
- 根据您的群晖存储卷修改路径（`/volume1/` 或 `/volume2/` 等）
- 确保目标目录有写入权限：`chown -R 1000:1000 /volume2/docker/niuzi-assistant/data`

5. **启动服务**

```bash
cd /volume2/docker/niuzi-assistant
docker-compose up -d --build
```

6. **查看日志**

```bash
docker-compose logs -f
```

7. **访问应用**

在浏览器中访问：
```
http://your-nas-ip:6688
```

#### 配置端口

如果需要修改端口，请编辑 `docker-compose.yml` 中的端口映射：

```yaml
frontend:
  ports:
    - "6688:80"  # 前端口:容器端口
```

修改后重新启动：
```bash
docker-compose down
docker-compose up -d
```

#### 数据持久化

所有数据保存在以下目录：

```
/volume2/docker/niuzi-assistant/data/
├── postgresql/      # 数据库数据
├── backend/          # 后端数据
├── backups/          # 备份文件
├── frontend/
│   └── logs/         # 前端日志
└── uploads/          # 上传文件
```

**备份数据**：
```bash
# 备份整个数据目录
tar -czf niuzi-backup-$(date +%Y%m%d).tar.gz /volume2/docker/niuzi-assistant/data
```

**恢复数据**：
```bash
# 解压备份文件
tar -xzf niuzi-backup-20231201.tar.gz -C /
```

## 项目结构

```
niuzi-assistant/
├── frontend/          # React前端
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── backend/           # Node.js后端
│   ├── src/
│   └── Dockerfile
├── database/          # 数据库初始化脚本
│   └── init.sql
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 开发模式

### 前端开发

```bash
cd frontend
npm install
npm start
```

### 后端开发

```bash
cd backend
npm install
npm run dev
```

## API文档

### 认证API

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 退出登录

### 记录API

- `POST /api/records/start` - 开始记录
- `POST /api/records/:id/end` - 结束记录
- `GET /api/records` - 获取记录列表
- `GET /api/records/stats` - 获取统计信息
- `GET /api/records/achievements` - 获取成就列表
- `DELETE /api/records/:id` - 删除记录

## 成就系统

项目包含 **25项成就**，分为以下几类：

- **连续打卡成就**：3天、7天、15天、30天、60天、100天
- **累计次数成就**：10次、50次、100次、500次、1000次
- **单日最高成就**：5次、10次、20次
- **单次时长成就**：1小时、3小时、5小时
- **总时长成就**：10小时、24小时、100小时
- **总天数成就**：7天、30天、100天

## 常见问题

### 端口冲突

如果端口被占用，修改 `docker-compose.yml` 中的端口映射。

### 数据丢失

确保数据卷正确映射到主机目录，并且有写入权限。

### 容器无法启动

查看日志定位问题：
```bash
docker-compose logs service-name
```

### 群晖权限问题

设置正确的权限：
```bash
chown -R 1000:1000 /volume2/docker/niuzi-assistant/data
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

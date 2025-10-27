# 数据持久化目录说明

本目录用于存储所有持久化数据，确保容器重建后数据不丢失。

## 目录结构

```
data/
├── postgresql/          # PostgreSQL 数据库备份
├── backend/             # 后端应用数据
│   ├── logs/           # 后端日志文件
│   └── exports/        # 导出的数据文件
├── backups/            # 数据库备份文件
├── frontend/           # 前端相关数据
│   ├── logs/          # Nginx 日志
│   └── cache/         # 前端缓存
└── uploads/            # 用户上传文件（未来扩展）
```

## 权限设置

在群晖上确保这些目录具有正确的权限：

```bash
# 在群晖SSH中执行
cd /volume2/docker/niuzi-assistant
sudo mkdir -p data/postgresql data/backend/logs data/backend/exports
sudo mkdir -p data/backups data/frontend/logs data/frontend/cache
sudo mkdir -p data/uploads

# 设置权限（确保Docker可以访问）
sudo chmod -R 755 data/
```

## 备份建议

1. **定期备份** `/volume2/docker/niuzi-assistant/data/` 目录
2. **使用群晖的备份功能**自动备份到其他位置
3. **导出数据库**定期手动导出数据库

## 数据恢复

如果需要恢复数据：
1. 停止容器：`docker-compose down`
2. 恢复数据文件到 `data/` 目录
3. 重新启动：`docker-compose up -d`

## 清理数据

⚠️ **警告**：删除 `data/` 目录将清除所有用户数据！

安全清理方法：
```bash
# 仅清理日志（保留数据库）
rm -rf data/backend/logs/*.log
rm -rf data/frontend/logs/*.log

# 仅清理缓存（保留数据）
rm -rf data/frontend/cache/*
```

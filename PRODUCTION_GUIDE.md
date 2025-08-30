# NoKing 生产环境部署指南

## 📋 目录

1. [环境要求](#环境要求)
2. [安全配置](#安全配置)
3. [部署步骤](#部署步骤)
4. [监控配置](#监控配置)
5. [备份策略](#备份策略)
6. [故障排除](#故障排除)
7. [性能优化](#性能优化)
8. [维护指南](#维护指南)

## 🖥️ 环境要求

### 系统要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **CPU**: 2核心以上
- **内存**: 4GB以上
- **存储**: 50GB以上SSD
- **网络**: 稳定的互联网连接

### 软件要求
- **Node.js**: 18.x LTS
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Nginx**: 1.18+
- **Redis**: 7.0+

## 🔒 安全配置

### 1. 环境变量安全

创建 `.env.production` 文件：

```bash
# 应用配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://noking.org

# 数据库配置
DATABASE_URL=your_production_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Redis配置
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
REDIS_PASSWORD=your_strong_redis_password

# API密钥
LLM_API_KEY=your_openai_api_key
NOTION_API_KEY=your_notion_api_key
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret

# 监控配置
LOG_LEVEL=info
LOG_REMOTE_ENDPOINT=your_log_endpoint
LOG_REMOTE_API_KEY=your_log_api_key

# 安全配置
SESSION_SECRET=your_very_long_random_session_secret
CSRF_SECRET=your_csrf_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 监控密码
GRAFANA_PASSWORD=your_grafana_password
```

### 2. 防火墙配置

```bash
# 允许SSH
sudo ufw allow ssh

# 允许HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 允许应用端口（仅内部访问）
sudo ufw allow from 10.0.0.0/8 to any port 3000
sudo ufw allow from 172.16.0.0/12 to any port 3000

# 启用防火墙
sudo ufw enable
```

### 3. SSL证书配置

使用Let's Encrypt获取免费SSL证书：

```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d noking.org -d www.noking.org

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 部署步骤

### 1. 使用Docker Compose部署

```bash
# 克隆项目
git clone https://github.com/your-org/noking.git
cd noking

# 配置环境变量
cp env.example .env.production
# 编辑 .env.production 文件

# 构建和启动服务
docker-compose up -d

# 检查服务状态
docker-compose ps
```

### 2. 使用Docker部署

```bash
# 构建镜像
docker build -t noking:latest .

# 运行容器
docker run -d \
  --name noking \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  noking:latest
```

### 3. 使用PM2部署

```bash
# 安装PM2
npm install -g pm2

# 构建应用
npm run build

# 启动应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
```

## 📊 监控配置

### 1. Prometheus配置

创建 `monitoring/prometheus.yml`：

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'noking-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 5s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
```

### 2. Grafana仪表板

导入以下仪表板：
- Node.js应用监控
- Redis性能监控
- Nginx访问日志
- 系统资源监控

### 3. 告警配置

设置以下告警规则：
- 应用响应时间 > 2秒
- 错误率 > 5%
- 内存使用率 > 80%
- 磁盘使用率 > 85%
- 服务不可用

## 💾 备份策略

### 1. 数据库备份

```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# 备份数据库
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/db_backup_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
EOF

# 设置定时任务
chmod +x backup.sh
crontab -e
# 添加：0 2 * * * /path/to/backup.sh
```

### 2. 文件备份

```bash
# 备份上传文件
rsync -avz /app/uploads/ /backups/uploads/

# 备份配置文件
cp .env.production /backups/config/
cp nginx.conf /backups/config/
```

### 3. 备份验证

```bash
# 测试数据库恢复
psql -d test_db < backup_file.sql

# 验证文件完整性
md5sum backup_file.sql.gz
```

## 🔧 故障排除

### 1. 常见问题

#### 应用无法启动
```bash
# 检查日志
docker-compose logs app
pm2 logs

# 检查端口占用
netstat -tulpn | grep :3000

# 检查环境变量
docker-compose exec app env | grep NODE_ENV
```

#### 数据库连接失败
```bash
# 测试数据库连接
docker-compose exec app npm run db:test

# 检查数据库状态
docker-compose ps redis
docker-compose exec redis redis-cli ping
```

#### 性能问题
```bash
# 检查系统资源
htop
df -h
free -h

# 检查应用性能
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:3000/api/health"
```

### 2. 日志分析

```bash
# 查看应用日志
tail -f logs/app.log

# 查看错误日志
grep ERROR logs/app.log

# 查看访问日志
tail -f logs/access.log
```

### 3. 性能调优

```bash
# 调整Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"

# 调整Redis配置
echo "maxmemory 2gb" >> redis.conf
echo "maxmemory-policy allkeys-lru" >> redis.conf

# 调整Nginx配置
worker_processes auto;
worker_connections 1024;
```

## ⚡ 性能优化

### 1. 应用优化

- 启用gzip压缩
- 使用CDN加速静态资源
- 实现缓存策略
- 优化数据库查询
- 使用连接池

### 2. 系统优化

```bash
# 调整内核参数
echo 'net.core.somaxconn = 65535' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_max_syn_backlog = 65535' >> /etc/sysctl.conf
sysctl -p

# 调整文件描述符限制
echo '* soft nofile 65535' >> /etc/security/limits.conf
echo '* hard nofile 65535' >> /etc/security/limits.conf
```

### 3. 监控优化

- 设置合理的告警阈值
- 定期检查监控数据
- 优化Prometheus存储
- 配置日志轮转

## 🛠️ 维护指南

### 1. 日常维护

```bash
# 每日检查
- 查看应用日志
- 检查系统资源
- 验证备份状态
- 检查监控告警

# 每周维护
- 更新依赖包
- 清理日志文件
- 检查SSL证书
- 性能分析

# 每月维护
- 安全更新
- 容量规划
- 备份测试
- 文档更新
```

### 2. 更新流程

```bash
# 1. 备份当前版本
docker-compose down
cp -r .next .next.backup

# 2. 拉取最新代码
git pull origin main

# 3. 更新依赖
npm ci

# 4. 构建新版本
npm run build

# 5. 重启服务
docker-compose up -d

# 6. 验证部署
curl -f http://localhost:3000/api/health
```

### 3. 回滚流程

```bash
# 1. 停止当前服务
docker-compose down

# 2. 恢复备份
rm -rf .next
mv .next.backup .next

# 3. 重启服务
docker-compose up -d

# 4. 验证回滚
curl -f http://localhost:3000/api/health
```

## 📞 支持

如遇到问题，请：

1. 查看日志文件
2. 检查监控面板
3. 参考故障排除指南
4. 联系技术支持团队

---

**注意**: 本指南适用于生产环境部署，请根据实际情况调整配置参数。

# 航班搜索后端服务

Express REST API，提供航班搜索、价格日历、城市查询等接口。

## 本地开发

```bash
npm install
npm run dev
```

服务启动在 http://localhost:3001

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/flights/search | 航班搜索 |
| GET | /api/flights/calendar | 价格日历 |
| GET | /api/flights/:id | 航班详情 |
| GET | /api/cities | 城市模糊搜索 |
| GET | /api/health | 健康检查 |

## 技术栈

- Express 5 + TypeScript
- tsx 运行时
- 实时定价引擎（基于时间、日期、航班特征动态计算价格与余票）

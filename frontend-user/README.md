# 国际机票搜索前端

React 用户端，提供航班搜索、筛选排序、价格日历、订单填写等完整功能。

## 本地开发

```bash
npm install
npm run dev
```

开发服务器启动在 http://localhost:8081 ，已配置 Vite 代理将 `/api` 请求转发至后端 3002 端口。

需先启动后端服务（backend），否则 API 请求会失败。

## 运行测试

```bash
npx vitest --run
```

## 技术栈

- React 18 + TypeScript + Vite
- 纯 CSS（CSS Variables 主题系统）
- Vitest + Testing Library

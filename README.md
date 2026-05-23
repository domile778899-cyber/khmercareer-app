# Khmer Career Express (高棉职通车)

柬埔寨求职招聘移动应用 - 基于 React + Capacitor + PWA 技术栈。

## 功能特性

- 30+ 页面完整求职招聘系统
- PWA 离线支持 + Service Worker
- 5 语言国际化（高棉/中文/英语/泰语/越南语）
- Capacitor 移动应用打包（Android/iOS）
- Google OAuth 登录集成
- 管理后台（Dashboard + 用户/职位/课程管理）

## 技术栈

| 技术 | 版本 |
|------|------|
| React | 19.2 |
| TypeScript | 5.9 |
| Vite | 7.2 |
| Tailwind CSS | 3.4 |
| Capacitor | 7.0 |
| shadcn/ui | latest |

## 快速开始

```bash
npm install
npm run dev       # 开发服务器
npm run build     # 生产构建
npx cap sync      # 同步到移动端
```

## CI/CD

- [Build Android APK](../../actions/workflows/build-android.yml)

## 许可证

MIT

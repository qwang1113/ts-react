# ts-react 

基于typescript&react(v16.8+)&antd&mobx的基础前端框架

## 开始使用

1. 在 `./src/pages` 目录下新建一个页面
2. 在 `./utils/menu.ts` 加入页面引用, 完成路由
3. happy coding

## Antd支持

fork自Antd仓库, 加上了响应式支持

## 懒加载

基于React.lazy, React.Suspense, 以及import方法实现页面或组件的lazyLoad

## GenerateForm

Antd的`Form`很强大, 但是使用略显繁琐, 这里对其简单进行了封装, 详情请查看`./src/pages/Home`

## 目录说明
```
.
├── build  // 编译config
│   ├── rules
│   │   ├── fileRules.js
│   │   ├── jsRules.js
│   │   ├── loaders.js
│   │   └── styleRules.js
│   ├── templates
│   │   └── index.html
│   ├── utils
│   │   ├── cleanup-folder.js
│   │   ├── config.js
│   │   ├── constants.js
│   │   ├── optimization.js
│   │   ├── plugins.js
│   │   ├── theme.js  // 主题
│   │   └── utils.js
│   └── webpack.config.js
├── package.json
├── postcss.config.js
├── readme.md
├── src // 项目源目录
│   ├── assets // 资源
│   │   └── less
│   │       └── base.less
│   ├── components // 组件
│   │   ├── App
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Base
│   │   │   └── index.tsx
│   │   ├── GenerateForm
│   │   │   ├── createElement.tsx
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Header
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Home
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Loading
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── NotFound
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── Sider
│   │   │   ├── index.less
│   │   │   ├── index.tsx
│   │   │   └── Menu.tsx
│   │   └── Upload
│   │       └── index.tsx
│   ├── index.less
│   ├── main.tsx // 页面入口
│   ├── pages // 页面目录
│   │   ├── Home
│   │   │   └── index.tsx
│   │   ├── Login
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   └── UserManager
│   │       └── index.tsx
│   ├── stores // 全局mobx store
│   │   ├── globalStore
│   │   │   ├── index.ts
│   │   │   └── type.d.ts
│   │   └── index.ts
│   └── utils // 工具目录
│       ├── api.ts // 网络相关
│       ├── index.ts
│       └── menu.ts // 页面路由配置
├── tsconfig.json
├── tsconfig.webpack.json
├── tslint.json
└── typings // ts的全局声明
    ├── global.d.ts
    ├── router-store.d.ts
    └── store.d.ts

```
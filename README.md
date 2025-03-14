# Web-Hologram 全息界面可视化编辑器

一个基于Three.js的在线全息界面可视化编辑器，灵感来源于钢铁侠电影中的全息投影界面。该项目旨在创建一个具有科技感的3D全息效果界面，支持GLTF模型加载和全息风格渲染。

## 项目特点

- 基于Three.js的3D渲染
- 全息效果着色器实现
- GLTF模型加载与渲染
- 交互式3D模型操作
- 科技感UI设计

## 技术栈

- Three.js - 3D渲染库
- WebGL/GLSL - 图形渲染和着色器编程
- JavaScript/TypeScript - 核心编程语言
- HTML5/CSS3 - 前端界面

## 功能模块

### 第一阶段：基础环境
- Three.js场景设置
- GLTF模型加载
- 基本相机和光照系统

### 计划功能
- 全息效果着色器
- 边缘发光效果
- 扫描线和网格效果
- 交互式控制界面
- 模型属性编辑

## 安装与使用

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

## 项目结构
```
/
├── public/
│   ├── models/         # GLTF模型文件
│   └── textures/       # 纹理资源
├── src/
│   ├── components/     # UI组件
│   ├── shaders/        # GLSL着色器代码
│   ├── utils/          # 工具函数
│   └── core/           # 核心渲染逻辑
└── index.html          # 入口HTML文件
```

## 浏览器兼容性

- 支持WebGL的现代浏览器
- Chrome (推荐)
- Firefox
- Edge
- Safari

## 许可证

MIT 
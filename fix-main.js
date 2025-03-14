const fs = require('fs');

const newContent = `import { SceneManager } from './core/SceneManager';
import { loadGLTFModel } from './utils/modelLoader';
import { setupEventListeners } from './utils/eventHandlers';
import { createDefaultModel } from './utils/createDefaultModel';

// 隐藏加载界面的函数
function hideLoadingScreen() {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    loadingElement.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      loadingElement.style.display = 'none';
    }, 500);
  }
}

// 初始化场景
let sceneManager;

// 加载模型
async function init() {
  try {
    // 获取容器元素
    const appElement = document.getElementById('app');
    if (!appElement) {
      throw new Error('找不到应用容器元素');
    }
    
    // 初始化场景
    sceneManager = new SceneManager(appElement);
    
    // 初始化渲染
    sceneManager.initialize();
    
    // 设置事件监听
    setupEventListeners(sceneManager);
    
    // 尝试加载默认模型
    try {
      // 修改模型路径，使用正确的Vite静态资源路径
      const model = await loadGLTFModel('/models/default.glb');
      if (model) {
        sceneManager.addModel(model);
        console.log('模型加载成功');
      }
    } catch (modelError) {
      console.warn('默认模型加载失败，使用基础几何体替代', modelError);
      // 加载失败时使用自定义默认模型
      const defaultModel = createDefaultModel();
      sceneManager.addModel(defaultModel);
    }
    
    // 隐藏加载界面
    hideLoadingScreen();
    
    // 开始动画循环
    sceneManager.animate();
    
  } catch (error) {
    console.error('初始化失败:', error);
    // 即使发生错误也要隐藏加载界面
    hideLoadingScreen();
    alert('应用初始化失败，请检查控制台获取详细信息。');
  }
}

// 确保DOM加载完成后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}`;

fs.writeFileSync('./src/main.js', newContent, 'utf8');
console.log('main.js 文件已修复'); 
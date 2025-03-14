import { SceneManager } from './core/SceneManager';
import { loadGLTFModel } from './utils/modelLoader';
import { setupEventListeners } from './utils/eventHandlers';
import { createDefaultModel } from './utils/createDefaultModel';
import { ControlPanel } from './components/ControlPanel';

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

// 全局变量
let sceneManager;
let controlPanel;

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
    
    // 使用默认几何体
    console.log('使用默认几何体');
    const defaultModel = createDefaultModel();
    sceneManager.addModel(defaultModel);
    
    // 创建控制面板
    controlPanel = new ControlPanel(sceneManager, {
      position: 'top-right',
      width: '300px'
    });
    
    // 隐藏加载界面
    hideLoadingScreen();
    
    // 开始动画循环
    sceneManager.animate();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
  } catch (error) {
    console.error('初始化失败:', error);
    // 即使发生错误也要隐藏加载界面
    hideLoadingScreen();
    alert('应用初始化失败，请检查控制台获取详细信息。');
  }
}

/**
 * 处理键盘快捷键
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleKeyboardShortcuts(event) {
  // 按下 'h' 键切换控制面板
  if (event.key === 'h' && controlPanel) {
    controlPanel.toggle();
  }
  
  // 按下 'e' 键切换全息效果
  if (event.key === 'e' && sceneManager) {
    sceneManager.toggleHologramEffect();
  }
}

/**
 * 清理资源
 */
function cleanup() {
  // 移除事件监听
  document.removeEventListener('keydown', handleKeyboardShortcuts);
  
  // 销毁控制面板
  if (controlPanel) {
    controlPanel.dispose();
    controlPanel = null;
  }
  
  // 销毁场景管理器
  if (sceneManager) {
    sceneManager.dispose();
    sceneManager = null;
  }
}

// 确保DOM加载完成后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 添加窗口卸载事件
window.addEventListener('beforeunload', cleanup);
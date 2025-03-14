import * as THREE from 'three';

/**
 * 设置事件监听器
 * @param {SceneManager} sceneManager - 场景管理器实例
 */
export function setupEventListeners(sceneManager) {
  // 窗口大小变化事件已在SceneManager中处理
  
  // 键盘事件
  window.addEventListener('keydown', (event) => {
    handleKeyDown(event, sceneManager);
  });
  
  // 鼠标点击事件
  window.addEventListener('click', (event) => {
    handleMouseClick(event, sceneManager);
  });
  
  // 添加触摸事件支持
  window.addEventListener('touchstart', (event) => {
    handleTouchStart(event, sceneManager);
  });
}

/**
 * 处理键盘按下事件
 * @param {KeyboardEvent} event - 键盘事件
 * @param {SceneManager} sceneManager - 场景管理器实例
 */
function handleKeyDown(event, sceneManager) {
  switch (event.key) {
    case 'r':
      // 重置相机位置
      if (sceneManager.camera) {
        sceneManager.camera.position.set(0, 1.5, 5);
        sceneManager.camera.lookAt(0, 0, 0);
      }
      break;
      
    case 'g':
      // 切换网格辅助线可见性
      if (sceneManager.scene) {
        sceneManager.scene.traverse((object) => {
          if (object.isGridHelper || object.isAxesHelper) {
            object.visible = !object.visible;
          }
        });
      }
      break;
      
    case 'f':
      // 全屏切换
      toggleFullscreen();
      break;
      
    default:
      break;
  }
}

/**
 * 处理鼠标点击事件
 * @param {MouseEvent} event - 鼠标事件
 * @param {SceneManager} sceneManager - 场景管理器实例
 */
function handleMouseClick(event, sceneManager) {
  // 计算鼠标在归一化设备坐标中的位置
  const mouse = {
    x: (event.clientX / window.innerWidth) * 2 - 1,
    y: -(event.clientY / window.innerHeight) * 2 + 1
  };
  
  // 在这里可以实现对象选择等功能
  // 示例：射线检测
  if (sceneManager.scene && sceneManager.camera) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, sceneManager.camera);
    
    // 获取与射线相交的对象
    const intersects = raycaster.intersectObjects(sceneManager.objects, true);
    
    if (intersects.length > 0) {
      console.log('点击了对象:', intersects[0].object);
      // 在这里可以添加对象选中的逻辑
    }
  }
}

/**
 * 处理触摸开始事件
 * @param {TouchEvent} event - 触摸事件
 * @param {SceneManager} sceneManager - 场景管理器实例
 */
function handleTouchStart(event, sceneManager) {
  // 防止默认行为（如滚动）
  event.preventDefault();
  
  if (event.touches.length === 1) {
    // 单指触摸，模拟鼠标点击
    const touch = event.touches[0];
    const simulatedEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY
    };
    
    handleMouseClick(simulatedEvent, sceneManager);
  }
}

/**
 * 切换全屏模式
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // 进入全屏
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
} 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HologramMaterial } from '../shaders/hologram/HologramMaterial.js';

/**
 * 场景管理器类
 * 负责管理Three.js场景、相机、渲染器等核心组件
 */
export class SceneManager {
  /**
   * 构造函数
   * @param {HTMLElement} container - 渲染容器
   */
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.mixers = [];
    this.objects = [];
    this.hologramMaterials = [];
    this.currentModel = null;
    this.isHologramEnabled = false;
    
    // 绑定方法到实例
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', this.onWindowResize);
  }
  
  /**
   * 初始化Three.js场景
   */
  initialize() {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    // 创建相机
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 1.5, 5);
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // 创建控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    // 添加光源
    this.setupLights();
    
    // 添加网格地面
    this.addGridHelper();
    
    // 创建默认全息材质
    this.defaultHologramMaterial = new HologramMaterial();
  }
  
  /**
   * 设置场景光源
   */
  setupLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    this.scene.add(ambientLight);
    
    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 2, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // 点光源
    const pointLight = new THREE.PointLight(0x0088ff, 1, 10);
    pointLight.position.set(0, 2, 0);
    this.scene.add(pointLight);
  }
  
  /**
   * 添加网格辅助线
   */
  addGridHelper() {
    const gridHelper = new THREE.GridHelper(10, 10, 0x0088ff, 0x001a33);
    this.scene.add(gridHelper);
    
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }
  
  /**
   * 添加GLTF模型到场景
   * @param {Object} model - 加载的GLTF模型
   * @param {Object} options - 模型选项
   * @param {number} options.scale - 模型缩放比例
   */
  addModel(model, options = {}) {
    if (!model) return;
    
    // 清除当前模型
    if (this.currentModel) {
      this.removeModel();
    }
    
    // 默认选项
    const defaultOptions = {
      scale: 1,
      position: { x: 0, y: 0, z: 0 }
    };
    
    // 合并选项
    const modelOptions = { ...defaultOptions, ...options };
    
    // 调整模型位置和大小
    model.scene.position.set(
      modelOptions.position.x, 
      modelOptions.position.y, 
      modelOptions.position.z
    );
    model.scene.scale.set(
      modelOptions.scale, 
      modelOptions.scale, 
      modelOptions.scale
    );
    
    // 遍历模型中的所有网格，设置材质和阴影
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // 添加到场景
    this.scene.add(model.scene);
    this.objects.push(model.scene);
    this.currentModel = model.scene;
    
    // 处理动画
    if (model.animations && model.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model.scene);
      this.mixers.push(mixer);
      
      // 播放所有动画
      model.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    }
    
    // 如果全息效果已启用，应用到新模型
    if (this.isHologramEnabled && this.currentModel) {
      this.applyHologramEffect();
    }
    
    return model.scene;
  }
  
  /**
   * 从场景中移除当前模型
   */
  removeModel() {
    if (this.currentModel) {
      // 如果有全息效果，先移除
      if (this.isHologramEnabled) {
        this.removeHologramEffect();
      }
      
      // 从场景中移除
      this.scene.remove(this.currentModel);
      
      // 从对象列表中移除
      const index = this.objects.indexOf(this.currentModel);
      if (index !== -1) {
        this.objects.splice(index, 1);
      }
      
      // 清理动画混合器
      this.mixers = this.mixers.filter(mixer => {
        if (mixer.getRoot() === this.currentModel) {
          mixer.stopAllAction();
          return false;
        }
        return true;
      });
      
      // 清空引用
      this.currentModel = null;
    }
  }
  
  /**
   * 清空场景中的所有物体
   */
  clearScene() {
    // 移除当前模型
    this.removeModel();
    
    // 移除所有对象
    while (this.objects.length > 0) {
      const object = this.objects.pop();
      this.scene.remove(object);
    }
    
    // 清理动画混合器
    this.mixers.forEach(mixer => {
      mixer.stopAllAction();
    });
    this.mixers = [];
    
    // 重置全息材质列表
    this.hologramMaterials = [];
  }
  
  /**
   * 添加默认几何体（当模型加载失败时使用）
   */
  addDefaultObject() {
    // 创建一个基础几何体
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x0088ff,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x001a33,
      wireframe: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    this.scene.add(mesh);
    this.objects.push(mesh);
    this.currentModel = mesh;
    
    return mesh;
  }
  
  /**
   * 应用全息效果到当前模型
   * @param {Object} options - 全息效果选项
   */
  applyHologramEffect(options = {}) {
    if (!this.currentModel) {
      console.warn('没有可应用全息效果的模型');
      return;
    }
    
    // 如果已经应用了全息效果，先移除
    if (this.isHologramEnabled) {
      this.removeHologramEffect();
    }
    
    console.log('应用全息效果，选项:', options);
    
    try {
      // 创建全息材质
      const hologramMaterial = new HologramMaterial(options);
      
      // 应用到当前模型
      const affectedMeshes = hologramMaterial.applyToObject(this.currentModel);
      console.log('应用全息效果到', affectedMeshes.length, '个网格');
      
      // 保存材质引用
      this.hologramMaterials.push(hologramMaterial);
      
      // 更新状态
      this.isHologramEnabled = true;
      
      return affectedMeshes;
    } catch (error) {
      console.error('应用全息效果失败:', error);
      return [];
    }
  }
  
  /**
   * 移除全息效果
   */
  removeHologramEffect() {
    if (!this.isHologramEnabled || !this.currentModel) return;
    
    // 恢复原始材质
    this.hologramMaterials.forEach(material => {
      material.removeFromObject(this.currentModel);
    });
    
    // 清空材质列表
    this.hologramMaterials = [];
    
    // 更新状态
    this.isHologramEnabled = false;
  }
  
  /**
   * 切换全息效果
   * @param {Object} options - 全息效果选项
   * @returns {boolean} - 是否启用全息效果
   */
  toggleHologramEffect(options = {}) {
    try {
      if (!this.currentModel) {
        throw new Error('没有可应用全息效果的模型');
      }
      
      if (this.isHologramEnabled) {
        this.removeHologramEffect();
        console.log('全息效果已关闭');
      } else {
        this.applyHologramEffect(options);
        console.log('全息效果已启用');
      }
      
      return this.isHologramEnabled;
    } catch (error) {
      console.error('切换全息效果失败:', error);
      throw new Error('切换全息效果失败: ' + error.message);
    }
  }
  
  /**
   * 更新全息效果参数
   * @param {Object} options - 全息效果参数
   */
  updateHologramEffect(options = {}) {
    if (!this.isHologramEnabled) {
      console.warn('全息效果未启用，无法更新参数');
      return;
    }
    
    if (!this.hologramMaterials || this.hologramMaterials.length === 0) {
      console.warn('没有找到全息材质，无法更新参数');
      return;
    }
    
    try {
      this.hologramMaterials.forEach(material => {
        // 记录更新前的参数值
        console.log('更新前的参数:', {
          color: material.uniforms.uColor.value.getHexString(),
          opacity: material.uniforms.uOpacity.value,
          rimIntensity: material.uniforms.uRimIntensity.value,
          wireframeWidth: material.uniforms.uWireframeWidth.value,
          gridIntensity: material.uniforms.uGridIntensity.value,
          glitchIntensity: material.uniforms.uGlitchIntensity.value
        });
        
        // 保存原始参数，用于检测是否有变化
        const originalParams = { ...material.params };
        
        if (options.color !== undefined) {
          material.setColor(new THREE.Color(options.color));
        }
        
        if (options.opacity !== undefined) {
          material.setOpacity(options.opacity);
        }
        
        if (options.rimIntensity !== undefined) {
          material.setRimIntensity(options.rimIntensity);
        }
        
        if (options.wireframeWidth !== undefined) {
          material.setWireframeWidth(options.wireframeWidth);
        }
        
        if (options.wireframeDensity !== undefined) {
          material.setWireframeDensity(options.wireframeDensity);
        }
        
        if (options.gridIntensity !== undefined) {
          material.setGridIntensity(options.gridIntensity);
        }
        
        if (options.glitchIntensity !== undefined) {
          material.setGlitchIntensity(options.glitchIntensity);
        }
        
        // 强制更新材质
        material.update(0, true);
        material.needsUpdate = true;
        
        // 记录更新后的参数值
        console.log('更新后的参数:', {
          color: material.uniforms.uColor.value.getHexString(),
          opacity: material.uniforms.uOpacity.value,
          rimIntensity: material.uniforms.uRimIntensity.value,
          wireframeWidth: material.uniforms.uWireframeWidth.value,
          gridIntensity: material.uniforms.uGridIntensity.value,
          glitchIntensity: material.uniforms.uGlitchIntensity.value
        });
        
        // 检查参数是否真的发生了变化
        let hasChanges = false;
        for (const key in material.params) {
          if (originalParams[key] !== material.params[key]) {
            hasChanges = true;
            break;
          }
        }
        
        if (!hasChanges) {
          console.warn('参数没有发生实际变化，可能是滑块值相同或舍入误差');
        }
      });
      
      // 记录更新成功
      console.log('全息效果参数更新成功:', options);
      
      // 立即渲染一帧，使变化可见
      this.renderFrame();
    } catch (error) {
      console.error('更新全息效果参数失败:', error);
      throw new Error('更新全息效果参数失败: ' + error.message);
    }
  }
  
  /**
   * 立即渲染一帧
   */
  renderFrame() {
    if (this.renderer && this.scene && this.camera) {
      // 更新全息材质
      if (this.isHologramEnabled) {
        this.hologramMaterials.forEach(material => {
          material.needsUpdate = true;
        });
      }
      
      // 渲染场景
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  /**
   * 动画循环
   */
  animate() {
    requestAnimationFrame(this.animate);
    
    // 更新控制器
    if (this.controls) {
      this.controls.update();
    }
    
    // 获取时间增量
    const delta = this.clock.getDelta();
    
    // 更新动画混合器
    this.mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    
    // 更新全息材质
    if (this.isHologramEnabled) {
      this.hologramMaterials.forEach(material => {
        material.update(delta);
        // 确保材质更新标志设置为true
        material.needsUpdate = true;
      });
    }
    
    // 渲染场景
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  /**
   * 窗口大小变化处理
   */
  onWindowResize() {
    if (this.camera && this.renderer) {
      // 更新相机宽高比
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      
      // 更新渲染器大小
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  
  /**
   * 清理资源
   */
  dispose() {
    // 移除事件监听
    window.removeEventListener('resize', this.onWindowResize);
    
    // 清理场景中的对象
    this.clearScene();
    
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
    
    // 清理控制器
    if (this.controls) {
      this.controls.dispose();
    }
    
    // 清空引用
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.mixers = [];
    this.objects = [];
    this.hologramMaterials = [];
    this.currentModel = null;
  }
  
  /**
   * 调整当前模型的缩放比例
   * @param {number} scale - 缩放比例
   */
  setModelScale(scale) {
    if (!this.currentModel) return;
    
    this.currentModel.scale.set(scale, scale, scale);
  }
  
  /**
   * 调整当前模型的位置
   * @param {Object} position - 位置对象 {x, y, z}
   */
  setModelPosition(position) {
    if (!this.currentModel) return;
    
    if (position.x !== undefined) this.currentModel.position.x = position.x;
    if (position.y !== undefined) this.currentModel.position.y = position.y;
    if (position.z !== undefined) this.currentModel.position.z = position.z;
  }
  
  /**
   * 调整当前模型的旋转
   * @param {Object} rotation - 旋转对象 {x, y, z}
   */
  setModelRotation(rotation) {
    if (!this.currentModel) return;
    
    if (rotation.x !== undefined) this.currentModel.rotation.x = rotation.x;
    if (rotation.y !== undefined) this.currentModel.rotation.y = rotation.y;
    if (rotation.z !== undefined) this.currentModel.rotation.z = rotation.z;
  }
} 
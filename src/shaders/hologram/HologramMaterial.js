import * as THREE from 'three';
import vertexShader from './hologramVertex.glsl';
import fragmentShader from './hologramFragment.glsl';

/**
 * 全息材质类
 * 管理全息效果的着色器材质
 */
export class HologramMaterial extends THREE.ShaderMaterial {
  /**
   * 构造函数
   * @param {Object} options - 材质选项
   */
  constructor(options = {}) {
    // 默认参数
    const defaults = {
      color: new THREE.Color(0x00aaff),
      opacity: 0.22,
      rimPower: 2.0,
      rimIntensity: 0.40,
      wireframeWidth: 1.35,
      wireframeDensity: 2.0,
      scanlineIntensity: 0.3,
      scanlineCount: 30.0,
      gridIntensity: 0.2,
      glitchIntensity: 0.03
    };
    
    // 合并选项
    const params = { ...defaults, ...options };
    
    // 创建着色器材质
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: params.color },
        uOpacity: { value: params.opacity },
        uTime: { value: 0 },
        uRimPower: { value: params.rimPower },
        uRimIntensity: { value: params.rimIntensity },
        uWireframeWidth: { value: params.wireframeWidth },
        uWireframeDensity: { value: params.wireframeDensity },
        uScanlineIntensity: { value: params.scanlineIntensity },
        uScanlineCount: { value: params.scanlineCount },
        uGridIntensity: { value: params.gridIntensity },
        uGlitchIntensity: { value: params.glitchIntensity }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    // 保存参数
    this.params = params;
    
    // 保存克隆的材质引用
    this.clones = [];
  }
  
  /**
   * 更新材质
   * @param {number} deltaTime - 时间增量
   * @param {boolean} forceUpdate - 是否强制更新所有参数
   */
  update(deltaTime, forceUpdate = false) {
    this.uniforms.uTime.value += deltaTime;
    
    // 强制更新时，确保所有uniform值都被重新应用
    if (forceUpdate) {
      this.uniforms.uColor.value = this.params.color;
      this.uniforms.uOpacity.value = this.params.opacity;
      this.uniforms.uRimPower.value = this.params.rimPower;
      this.uniforms.uRimIntensity.value = this.params.rimIntensity;
      this.uniforms.uWireframeWidth.value = this.params.wireframeWidth;
      this.uniforms.uWireframeDensity.value = this.params.wireframeDensity;
      this.uniforms.uScanlineIntensity.value = this.params.scanlineIntensity;
      this.uniforms.uScanlineCount.value = this.params.scanlineCount;
      this.uniforms.uGridIntensity.value = this.params.gridIntensity;
      this.uniforms.uGlitchIntensity.value = this.params.glitchIntensity;
      
      // 强制材质更新
      this.needsUpdate = true;
      
      // 同步更新所有克隆的材质
      this.syncClones();
    }
  }
  
  /**
   * 同步所有克隆的材质
   */
  syncClones() {
    this.clones.forEach(clone => {
      // 同步所有uniform值
      clone.uniforms.uColor.value = this.uniforms.uColor.value;
      clone.uniforms.uOpacity.value = this.uniforms.uOpacity.value;
      clone.uniforms.uRimPower.value = this.uniforms.uRimPower.value;
      clone.uniforms.uRimIntensity.value = this.uniforms.uRimIntensity.value;
      clone.uniforms.uWireframeWidth.value = this.uniforms.uWireframeWidth.value;
      clone.uniforms.uWireframeDensity.value = this.uniforms.uWireframeDensity.value;
      clone.uniforms.uScanlineIntensity.value = this.uniforms.uScanlineIntensity.value;
      clone.uniforms.uScanlineCount.value = this.uniforms.uScanlineCount.value;
      clone.uniforms.uGridIntensity.value = this.uniforms.uGridIntensity.value;
      clone.uniforms.uGlitchIntensity.value = this.uniforms.uGlitchIntensity.value;
      
      // 同步参数
      clone.params = { ...this.params };
      
      // 强制材质更新
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置颜色
   * @param {THREE.Color} color - 新颜色
   */
  setColor(color) {
    console.log('设置全息颜色:', color);
    this.uniforms.uColor.value = color;
    this.params.color = color;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uColor.value = color;
      clone.params.color = color;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置透明度
   * @param {number} opacity - 新透明度
   */
  setOpacity(opacity) {
    console.log('设置全息透明度:', opacity);
    this.uniforms.uOpacity.value = opacity;
    this.params.opacity = opacity;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uOpacity.value = opacity;
      clone.params.opacity = opacity;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置边缘发光强度
   * @param {number} intensity - 发光强度
   */
  setRimIntensity(intensity) {
    console.log('设置边缘发光强度:', intensity);
    this.uniforms.uRimIntensity.value = intensity;
    this.params.rimIntensity = intensity;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uRimIntensity.value = intensity;
      clone.params.rimIntensity = intensity;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置线框宽度
   * @param {number} width - 线框宽度
   */
  setWireframeWidth(width) {
    console.log('设置线框宽度:', width);
    this.uniforms.uWireframeWidth.value = width;
    this.params.wireframeWidth = width;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uWireframeWidth.value = width;
      clone.params.wireframeWidth = width;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置线框密度
   * @param {number} density - 线框密度
   */
  setWireframeDensity(density) {
    console.log('设置线框密度:', density);
    this.uniforms.uWireframeDensity.value = density;
    this.params.wireframeDensity = density;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uWireframeDensity.value = density;
      clone.params.wireframeDensity = density;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置网格强度
   * @param {number} intensity - 网格强度
   */
  setGridIntensity(intensity) {
    console.log('设置网格强度:', intensity);
    this.uniforms.uGridIntensity.value = intensity;
    this.params.gridIntensity = intensity;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uGridIntensity.value = intensity;
      clone.params.gridIntensity = intensity;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 设置故障效果强度
   * @param {number} intensity - 故障强度
   */
  setGlitchIntensity(intensity) {
    console.log('设置故障效果强度:', intensity);
    this.uniforms.uGlitchIntensity.value = intensity;
    this.params.glitchIntensity = intensity;
    this.needsUpdate = true;
    
    // 同步克隆的材质
    this.clones.forEach(clone => {
      clone.uniforms.uGlitchIntensity.value = intensity;
      clone.params.glitchIntensity = intensity;
      clone.needsUpdate = true;
    });
  }
  
  /**
   * 应用全息材质到对象
   * @param {THREE.Object3D} object - 目标对象
   * @returns {Array} - 应用了材质的网格数组
   */
  applyToObject(object) {
    const meshes = [];
    
    object.traverse((child) => {
      if (child.isMesh) {
        // 保存原始材质
        child.userData.originalMaterial = child.material;
        
        // 创建新的全息材质实例
        const hologramMaterial = this.clone();
        
        // 添加到克隆列表
        this.clones.push(hologramMaterial);
        
        // 应用材质
        child.material = hologramMaterial;
        meshes.push(child);
      }
    });
    
    return meshes;
  }
  
  /**
   * 恢复对象的原始材质
   * @param {THREE.Object3D} object - 目标对象
   */
  removeFromObject(object) {
    object.traverse((child) => {
      if (child.isMesh && child.userData.originalMaterial) {
        child.material = child.userData.originalMaterial;
        delete child.userData.originalMaterial;
      }
    });
    
    // 清空克隆列表
    this.clones = [];
  }
  
  /**
   * 克隆材质
   * @returns {HologramMaterial} - 克隆的材质
   */
  clone() {
    return new HologramMaterial(this.params);
  }
} 
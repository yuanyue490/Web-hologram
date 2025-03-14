import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three';

/**
 * 加载HDR环境贴图
 * @param {string} url - HDR文件URL
 * @returns {Promise} - 返回处理后的环境贴图
 */
export function loadHDREnvironment(url, renderer) {
  return new Promise((resolve, reject) => {
    const loader = new RGBELoader();
    loader.setDataType(THREE.HalfFloatType);
    
    loader.load(
      url,
      (texture) => {
        const pmremGenerator = new PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        texture.dispose();
        
        console.log('HDR环境贴图加载成功:', url);
        resolve(envMap);
      },
      (progress) => {
        // 加载进度
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`HDR环境贴图加载进度: ${Math.round(percentComplete)}%`);
        }
      },
      (error) => {
        console.error('HDR环境贴图加载失败:', error);
        reject(error);
      }
    );
  });
}

/**
 * 创建渐变天空球
 * @param {Object} options - 渐变选项
 * @param {THREE.Color} options.topColor - 顶部颜色
 * @param {THREE.Color} options.bottomColor - 底部颜色
 * @param {number} options.offset - 渐变偏移
 * @param {number} options.exponent - 渐变指数
 * @returns {THREE.Mesh} - 天空球网格
 */
export function createGradientSkybox(options = {}) {
  const defaults = {
    topColor: new THREE.Color(0x00aaff),
    bottomColor: new THREE.Color(0x171320),
    offset: 0.4,
    exponent: 0.6
  };
  
  const params = { ...defaults, ...options };
  
  // 创建着色器材质
  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: params.topColor },
      bottomColor: { value: params.bottomColor },
      offset: { value: params.offset },
      exponent: { value: params.exponent }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      
      varying vec3 vWorldPosition;
      
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        float t = max(0.0, min(1.0, pow(max(0.0, h), exponent)));
        
        gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
      }
    `,
    side: THREE.BackSide,
    fog: false
  });
  
  // 创建天空球几何体
  const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
  
  // 创建天空球网格
  const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
  
  return skybox;
}

/**
 * 创建纯色天空球
 * @param {THREE.Color} color - 天空球颜色
 * @returns {THREE.Mesh} - 天空球网格
 */
export function createSolidColorSkybox(color = new THREE.Color(0x000000)) {
  // 创建材质
  const skyMaterial = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.BackSide,
    fog: false
  });
  
  // 创建天空球几何体
  const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
  
  // 创建天空球网格
  const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
  
  return skybox;
} 
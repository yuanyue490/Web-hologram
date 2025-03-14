import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * 加载GLTF模型
 * @param {string} url - 模型URL
 * @returns {Promise} - 返回加载的模型
 */
export function loadGLTFModel(url) {
  return new Promise((resolve, reject) => {
    // 创建DRACO加载器实例
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    
    // 创建GLTF加载器实例
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    
    // 加载模型
    loader.load(
      url,
      (gltf) => {
        console.log('GLTF模型加载成功:', url);
        resolve(gltf);
      },
      (progress) => {
        // 加载进度
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`模型加载进度: ${Math.round(percentComplete)}%`);
        }
      },
      (error) => {
        console.error('GLTF模型加载失败:', error);
        reject(error);
      }
    );
  });
}

/**
 * 加载纹理
 * @param {string} url - 纹理URL
 * @returns {Promise} - 返回加载的纹理
 */
export function loadTexture(url) {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(
      url,
      (texture) => {
        console.log('纹理加载成功:', url);
        resolve(texture);
      },
      (progress) => {
        // 加载进度
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`纹理加载进度: ${Math.round(percentComplete)}%`);
        }
      },
      (error) => {
        console.error('纹理加载失败:', error);
        reject(error);
      }
    );
  });
}

/**
 * 加载环境贴图
 * @param {string} path - 环境贴图路径
 * @param {Array} urls - 环境贴图文件名数组
 * @returns {Promise} - 返回加载的环境贴图
 */
export function loadEnvironmentMap(path, urls) {
  return new Promise((resolve, reject) => {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath(path);
    
    cubeTextureLoader.load(
      urls,
      (texture) => {
        console.log('环境贴图加载成功');
        resolve(texture);
      },
      (progress) => {
        // 加载进度
        if (progress.lengthComputable) {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`环境贴图加载进度: ${Math.round(percentComplete)}%`);
        }
      },
      (error) => {
        console.error('环境贴图加载失败:', error);
        reject(error);
      }
    );
  });
} 
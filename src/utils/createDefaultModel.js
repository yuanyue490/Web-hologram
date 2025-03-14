import * as THREE from 'three';

/**
 * 创建默认GLTF模型结构
 * 当没有外部模型可用时使用
 * @returns {Object} - 模拟GLTF模型结构的对象
 */
export function createDefaultModel() {
  // 创建一个组作为模型的根节点
  const scene = new THREE.Group();
  
  // 创建几个基础几何体
  const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32)
  ];
  
  // 创建材质
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0x0088ff,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x001a33,
      transparent: true,
      opacity: 0.8
    }),
    new THREE.MeshStandardMaterial({
      color: 0x00aaff,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0x002244,
      transparent: true,
      opacity: 0.9
    }),
    new THREE.MeshStandardMaterial({
      color: 0x0066cc,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x001122,
      transparent: true,
      opacity: 0.7
    })
  ];
  
  // 创建网格并添加到场景
  const cube = new THREE.Mesh(geometries[0], materials[0]);
  cube.position.set(-1.2, 0, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
  
  const sphere = new THREE.Mesh(geometries[1], materials[1]);
  sphere.position.set(0, 0, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);
  
  const cylinder = new THREE.Mesh(geometries[2], materials[2]);
  cylinder.position.set(1.2, 0, 0);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  scene.add(cylinder);
  
  // 添加一些线框效果
  const edges = new THREE.EdgesGeometry(geometries[0]);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x00ffff })
  );
  line.position.copy(cube.position);
  scene.add(line);
  
  // 创建一个模拟的GLTF对象结构
  return {
    scene: scene,
    animations: [] // 没有动画
  };
} 
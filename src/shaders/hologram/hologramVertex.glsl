varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

void main() {
  // 传递UV坐标到片元着色器
  vUv = uv;
  
  // 传递法线到片元着色器
  vNormal = normalize(normalMatrix * normal);
  
  // 传递局部坐标到片元着色器
  vPosition = position;
  
  // 计算世界坐标
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  
  // 设置顶点位置
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
} 
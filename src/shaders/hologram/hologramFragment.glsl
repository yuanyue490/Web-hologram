uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;
uniform float uRimPower;
uniform float uRimIntensity;
uniform float uWireframeWidth;
uniform float uWireframeDensity;
uniform float uScanlineIntensity;
uniform float uScanlineCount;
uniform float uGridIntensity;
uniform float uGlitchIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

// 随机函数
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 噪声函数
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  // 四个角的随机值
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  // 平滑插值
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// 线框描边效果函数
float wireframe(vec2 uv, float width) {
  float gridLine = 0.0;
  vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
  float line = min(grid.x, grid.y);
  gridLine = 1.0 - min(line, 1.0);
  
  // 调整线宽
  return smoothstep(0.0, width, gridLine);
}

void main() {
  // 基础颜色
  vec3 baseColor = uColor;
  
  // 边缘发光效果（菲涅尔效果）
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float rimFactor = 1.0 - max(0.0, dot(viewDirection, vNormal));
  rimFactor = pow(rimFactor, uRimPower) * uRimIntensity;
  
  // 扫描线效果
  float scanline = sin(vWorldPosition.y * uScanlineCount + uTime * 1.0) * 0.5 + 0.5;
  scanline = pow(scanline, 2.0) * uScanlineIntensity;
  
  // 网格效果 - 增强网格可见性
  float gridScale = 50.0 + 50.0 * uGridIntensity; // 网格密度随强度变化
  float gridThreshold = 0.95 - 0.1 * uGridIntensity; // 网格线宽度随强度变化
  float gridX = step(gridThreshold, sin(vUv.x * gridScale) * 0.5 + 0.5) * uGridIntensity;
  float gridY = step(gridThreshold, sin(vUv.y * gridScale) * 0.5 + 0.5) * uGridIntensity;
  float grid = clamp(gridX + gridY, 0.0, 1.0);
  
  // 线框描边效果 - 使用 uWireframeWidth 控制线宽，使用 uWireframeDensity 控制线框密度
  float wireframeEffect = wireframe(vUv * uWireframeDensity, uWireframeWidth);
  
  // 故障效果（随时间变化）- 增强故障可见性
  float glitchScale = 100.0 + 100.0 * uGlitchIntensity; // 故障密度随强度变化
  float glitchSpeed = 10.0 + 20.0 * uGlitchIntensity; // 故障速度随强度变化
  float glitchNoise = noise(vec2(vUv.y * glitchScale, uTime * glitchSpeed)) * uGlitchIntensity;
  float glitchThreshold = 0.98 - 0.1 * uGlitchIntensity; // 故障阈值随强度变化
  float glitchOffset = step(glitchThreshold, glitchNoise) * 0.2 * uGlitchIntensity;
  
  // 组合所有效果 - 增加参数影响范围
  vec3 finalColor = baseColor + baseColor * rimFactor * 2.0 + baseColor * scanline * 2.0 + vec3(grid) * 2.0 + vec3(glitchOffset) * 2.0 + baseColor * wireframeEffect * 3.0;
  
  // 透明度 - 增加参数对透明度的影响
  float alpha = uOpacity * (0.5 + rimFactor * 0.7 + scanline * 0.3 + wireframeEffect * 0.5);
  alpha = clamp(alpha, 0.0, 1.0);
  
  // 输出最终颜色
  gl_FragColor = vec4(finalColor, alpha);
} 
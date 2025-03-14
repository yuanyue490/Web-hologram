import { defineConfig } from 'vite';
import { resolve } from 'path';

// 着色器文件导入插件
function glslPlugin() {
  return {
    name: 'vite-plugin-glsl',
    transform(code, id) {
      if (/\.(glsl|vert|frag)$/.test(id)) {
        // 转义代码中的特殊字符
        const escapedCode = code
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$/g, '\\$')
          .replace(/\r?\n/g, '\\n');
        
        // 返回处理后的代码
        return {
          code: `export default \`${escapedCode}\`;`,
          map: null
        };
      }
    }
  };
}

export default defineConfig({
  server: {
    host: true,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    glslPlugin()
  ]
}); 
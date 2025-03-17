const { build } = require('vite');
const path = require('path');
const fs = require('fs');

async function buildApp() {
  try {
    // 打印当前工作目录和文件列表，帮助调试
    console.log('当前工作目录:', process.cwd());
    console.log('目录内容:', fs.readdirSync(process.cwd()));
    
    // 检查vite.config.js是否存在
    const configPath = path.resolve(__dirname, 'vite.config.js');
    if (!fs.existsSync(configPath)) {
      throw new Error(`配置文件不存在: ${configPath}`);
    }
    console.log('找到配置文件:', configPath);
    
    // 检查index.html是否存在
    const indexPath = path.resolve(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error(`入口HTML文件不存在: ${indexPath}`);
    }
    console.log('找到入口HTML文件:', indexPath);
    
    console.log('开始构建应用...');
    
    // 使用Vite的Node.js API进行构建
    await build({
      configFile: configPath,
      root: process.cwd(),
      mode: 'production',
      logLevel: 'info' // 显示更多日志信息
    });
    
    console.log('构建完成！');
    
    // 检查dist目录是否创建成功
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      console.log('dist目录内容:', fs.readdirSync(distPath));
    } else {
      console.warn('警告: dist目录未创建');
    }
  } catch (error) {
    console.error('构建过程中出错:', error);
    process.exit(1);
  }
}

buildApp(); 
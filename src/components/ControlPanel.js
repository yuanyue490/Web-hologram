/**
 * 控制面板类
 * 提供UI界面控制场景和全息效果
 */
export class ControlPanel {
  /**
   * 构造函数
   * @param {SceneManager} sceneManager - 场景管理器实例
   * @param {Object} options - 配置选项
   */
  constructor(sceneManager, options = {}) {
    this.sceneManager = sceneManager;
    this.options = Object.assign({
      position: 'top-right',
      width: '300px'
    }, options);
    
    this.container = null;
    this.fileInput = null;
    
    // 防抖定时器
    this.debounceTimers = {};
    
    this.createPanel();
  }
  
  /**
   * 创建控制面板
   */
  createPanel() {
    // 创建面板容器
    this.container = document.createElement('div');
    this.container.className = 'control-panel';
    this.container.style.position = 'fixed';
    this.container.style.width = this.options.width;
    this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.container.style.color = '#0af';
    this.container.style.padding = '15px';
    this.container.style.borderRadius = '5px';
    this.container.style.fontFamily = 'Arial, sans-serif';
    this.container.style.zIndex = '1000';
    this.container.style.backdropFilter = 'blur(10px)';
    this.container.style.boxShadow = '0 0 10px rgba(0, 170, 255, 0.5)';
    this.container.style.border = '1px solid rgba(0, 170, 255, 0.3)';
    
    // 设置面板位置
    switch (this.options.position) {
      case 'top-left':
        this.container.style.top = '20px';
        this.container.style.left = '20px';
        break;
      case 'top-right':
        this.container.style.top = '20px';
        this.container.style.right = '20px';
        break;
      case 'bottom-left':
        this.container.style.bottom = '20px';
        this.container.style.left = '20px';
        break;
      case 'bottom-right':
        this.container.style.bottom = '20px';
        this.container.style.right = '20px';
        break;
      default:
        this.container.style.top = '20px';
        this.container.style.right = '20px';
    }
    
    // 添加标题
    const title = document.createElement('h2');
    title.textContent = '全息界面控制';
    title.style.margin = '0 0 15px 0';
    title.style.fontSize = '18px';
    title.style.textAlign = 'center';
    title.style.color = '#0af';
    title.style.textShadow = '0 0 5px rgba(0, 170, 255, 0.7)';
    this.container.appendChild(title);
    
    // 添加模型控制部分
    this.addModelControls();
    
    // 添加全息效果控制部分
    this.addHologramControls();
    
    // 添加到文档
    document.body.appendChild(this.container);
  }
  
  /**
   * 添加模型控制部分
   */
  addModelControls() {
    const section = this.createSection('模型控制');
    
    // 添加模型文件输入
    const fileInputContainer = document.createElement('div');
    fileInputContainer.style.marginBottom = '10px';
    
    const fileLabel = document.createElement('label');
    fileLabel.textContent = '导入模型 (GLTF/GLB): ';
    fileLabel.style.display = 'block';
    fileLabel.style.marginBottom = '5px';
    fileInputContainer.appendChild(fileLabel);
    
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.gltf,.glb';
    this.fileInput.style.width = '100%';
    this.fileInput.style.marginBottom = '10px';
    this.fileInput.style.color = '#0af';
    this.fileInput.addEventListener('change', this.handleFileUpload.bind(this));
    fileInputContainer.appendChild(this.fileInput);
    
    section.appendChild(fileInputContainer);
    
    // 添加模型缩放控制
    this.addSlider(section, '模型缩放', 0.01, 10, 1, 0.01, (value) => {
      this.sceneManager.setModelScale(value);
    });
    
    // 添加模型位置控制
    const positionContainer = document.createElement('div');
    positionContainer.style.marginBottom = '15px';
    
    const positionLabel = document.createElement('label');
    positionLabel.textContent = '模型位置:';
    positionLabel.style.display = 'block';
    positionLabel.style.marginBottom = '5px';
    positionContainer.appendChild(positionLabel);
    
    // X位置
    const xContainer = document.createElement('div');
    xContainer.style.display = 'flex';
    xContainer.style.alignItems = 'center';
    xContainer.style.marginBottom = '5px';
    
    const xLabel = document.createElement('span');
    xLabel.textContent = 'X: ';
    xLabel.style.width = '20px';
    xContainer.appendChild(xLabel);
    
    const xInput = document.createElement('input');
    xInput.type = 'range';
    xInput.min = '-5';
    xInput.max = '5';
    xInput.step = '0.1';
    xInput.value = '0';
    xInput.style.flex = '1';
    xInput.addEventListener('input', () => {
      this.sceneManager.setModelPosition({ x: parseFloat(xInput.value) });
      xValue.textContent = xInput.value;
    });
    xContainer.appendChild(xInput);
    
    const xValue = document.createElement('span');
    xValue.textContent = '0';
    xValue.style.width = '30px';
    xValue.style.textAlign = 'right';
    xContainer.appendChild(xValue);
    
    positionContainer.appendChild(xContainer);
    
    // Y位置
    const yContainer = document.createElement('div');
    yContainer.style.display = 'flex';
    yContainer.style.alignItems = 'center';
    yContainer.style.marginBottom = '5px';
    
    const yLabel = document.createElement('span');
    yLabel.textContent = 'Y: ';
    yLabel.style.width = '20px';
    yContainer.appendChild(yLabel);
    
    const yInput = document.createElement('input');
    yInput.type = 'range';
    yInput.min = '-5';
    yInput.max = '5';
    yInput.step = '0.1';
    yInput.value = '0';
    yInput.style.flex = '1';
    yInput.addEventListener('input', () => {
      this.sceneManager.setModelPosition({ y: parseFloat(yInput.value) });
      yValue.textContent = yInput.value;
    });
    yContainer.appendChild(yInput);
    
    const yValue = document.createElement('span');
    yValue.textContent = '0';
    yValue.style.width = '30px';
    yValue.style.textAlign = 'right';
    yContainer.appendChild(yValue);
    
    positionContainer.appendChild(yContainer);
    
    // Z位置
    const zContainer = document.createElement('div');
    zContainer.style.display = 'flex';
    zContainer.style.alignItems = 'center';
    
    const zLabel = document.createElement('span');
    zLabel.textContent = 'Z: ';
    zLabel.style.width = '20px';
    zContainer.appendChild(zLabel);
    
    const zInput = document.createElement('input');
    zInput.type = 'range';
    zInput.min = '-5';
    zInput.max = '5';
    zInput.step = '0.1';
    zInput.value = '0';
    zInput.style.flex = '1';
    zInput.addEventListener('input', () => {
      this.sceneManager.setModelPosition({ z: parseFloat(zInput.value) });
      zValue.textContent = zInput.value;
    });
    zContainer.appendChild(zInput);
    
    const zValue = document.createElement('span');
    zValue.textContent = '0';
    zValue.style.width = '30px';
    zValue.style.textAlign = 'right';
    zContainer.appendChild(zValue);
    
    positionContainer.appendChild(zContainer);
    
    section.appendChild(positionContainer);
    
    // 添加清空场景按钮
    const clearButton = this.createButton('清空场景', () => {
      this.sceneManager.clearScene();
    });
    section.appendChild(clearButton);
    
    // 添加默认模型按钮
    const defaultModelButton = this.createButton('加载默认模型', () => {
      this.sceneManager.addDefaultObject();
    });
    section.appendChild(defaultModelButton);
    
    this.container.appendChild(section);
  }
  
  /**
   * 添加全息效果控制部分
   */
  addHologramControls() {
    const section = this.createSection('全息效果');
    
    // 添加全息效果开关
    const toggleContainer = document.createElement('div');
    toggleContainer.style.marginBottom = '15px';
    toggleContainer.style.display = 'flex';
    toggleContainer.style.alignItems = 'center';
    
    const toggleLabel = document.createElement('label');
    toggleLabel.textContent = '启用全息效果: ';
    toggleLabel.style.marginRight = '10px';
    toggleContainer.appendChild(toggleLabel);
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '开启';
    toggleButton.style.backgroundColor = 'rgba(0, 170, 255, 0.2)';
    toggleButton.style.color = '#0af';
    toggleButton.style.border = '1px solid #0af';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.transition = 'all 0.3s ease';
    
    toggleButton.addEventListener('click', () => {
      try {
        const isEnabled = this.sceneManager.toggleHologramEffect();
        toggleButton.textContent = isEnabled ? '关闭' : '开启';
        toggleButton.style.backgroundColor = isEnabled ? 'rgba(0, 170, 255, 0.4)' : 'rgba(0, 170, 255, 0.2)';
        
        // 如果启用了全息效果，立即应用当前所有滑块的值
        if (isEnabled) {
          this.applyAllHologramSettings();
        }
      } catch (error) {
        console.error('切换全息效果失败:', error);
        this.showMessage('切换全息效果失败: ' + error.message, 'error');
      }
    });
    
    // 添加重置参数按钮
    const resetButton = document.createElement('button');
    resetButton.textContent = '重置参数';
    resetButton.style.backgroundColor = 'rgba(0, 170, 255, 0.2)';
    resetButton.style.color = '#0af';
    resetButton.style.border = '1px solid #0af';
    resetButton.style.borderRadius = '4px';
    resetButton.style.padding = '5px 10px';
    resetButton.style.marginLeft = '10px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.transition = 'all 0.3s ease';
    
    resetButton.addEventListener('click', () => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法重置参数');
          this.showMessage('全息效果未启用，请先开启全息效果', 'info');
          return;
        }
        
        // 重置所有滑块到默认值
        this.resetHologramSliders();
        
        // 应用默认参数
        this.sceneManager.updateHologramEffect({
          color: '#00aaff',
          opacity: 0.22,
          rimIntensity: 0.40,
          wireframeWidth: 1.35,
          wireframeDensity: 2.0,
          gridIntensity: 0.2,
          glitchIntensity: 0.03
        });
        
        // 更新颜色选择器
        const colorInput = this.container.querySelector('input[type="color"]');
        if (colorInput) {
          colorInput.value = '#00aaff';
        }
        
        this.showMessage('全息效果参数已重置为默认值', 'success');
      } catch (error) {
        console.error('重置参数失败:', error);
        this.showMessage('重置参数失败: ' + error.message, 'error');
      }
    });
    
    // 添加调试按钮
    const debugButton = document.createElement('button');
    debugButton.textContent = '调试参数';
    debugButton.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
    debugButton.style.color = '#ffa500';
    debugButton.style.border = '1px solid #ffa500';
    debugButton.style.borderRadius = '4px';
    debugButton.style.padding = '5px 10px';
    debugButton.style.marginLeft = '10px';
    debugButton.style.cursor = 'pointer';
    debugButton.style.transition = 'all 0.3s ease';
    
    debugButton.addEventListener('click', () => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法显示参数');
          this.showMessage('全息效果未启用，请先开启全息效果', 'info');
          return;
        }
        
        // 获取当前参数
        const materials = this.sceneManager.hologramMaterials;
        if (materials && materials.length > 0) {
          const material = materials[0];
          const params = {
            color: material.uniforms.uColor.value.getHexString(),
            opacity: material.uniforms.uOpacity.value.toFixed(2),
            rimIntensity: material.uniforms.uRimIntensity.value.toFixed(2),
            wireframeWidth: material.uniforms.uWireframeWidth.value.toFixed(2),
            wireframeDensity: material.uniforms.uWireframeDensity.value.toFixed(2),
            gridIntensity: material.uniforms.uGridIntensity.value.toFixed(2),
            glitchIntensity: material.uniforms.uGlitchIntensity.value.toFixed(2)
          };
          
          // 在控制台显示参数
          console.log('当前全息效果参数:', params);
          
          // 创建参数显示文本
          const paramsText = `
            颜色: #${params.color}
            透明度: ${params.opacity}
            边缘发光: ${params.rimIntensity}
            线框宽度: ${params.wireframeWidth}
            线框密度: ${params.wireframeDensity}
            网格强度: ${params.gridIntensity}
            故障效果: ${params.glitchIntensity}
          `;
          
          // 显示参数
          this.showMessage(paramsText, 'info', 5000);
          
          // 强制更新材质
          material.update(0, true);
          material.needsUpdate = true;
        } else {
          this.showMessage('未找到全息材质', 'error');
        }
      } catch (error) {
        console.error('显示参数失败:', error);
        this.showMessage('显示参数失败: ' + error.message, 'error');
      }
    });
    
    toggleContainer.appendChild(toggleButton);
    toggleContainer.appendChild(resetButton);
    toggleContainer.appendChild(debugButton);
    section.appendChild(toggleContainer);
    
    // 添加颜色选择器
    const colorContainer = document.createElement('div');
    colorContainer.style.marginBottom = '10px';
    
    const colorLabel = document.createElement('label');
    colorLabel.textContent = '全息颜色: ';
    colorLabel.style.display = 'block';
    colorLabel.style.marginBottom = '5px';
    colorContainer.appendChild(colorLabel);
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#00aaff';
    colorInput.style.width = '100%';
    colorInput.style.height = '30px';
    colorInput.style.border = 'none';
    colorInput.style.borderRadius = '4px';
    colorInput.style.cursor = 'pointer';
    
    colorInput.addEventListener('input', () => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新颜色');
          return;
        }
        console.log('颜色选择器更新颜色:', colorInput.value);
        this.sceneManager.updateHologramEffect({
          color: colorInput.value
        });
      } catch (error) {
        console.error('更新全息颜色失败:', error);
      }
    });
    
    colorContainer.appendChild(colorInput);
    section.appendChild(colorContainer);
    
    // 保存滑块引用，以便后续批量更新
    this.hologramSliders = {};
    
    // 添加滑块控制
    this.hologramSliders.opacity = this.addSlider(section, '透明度', 0, 1, 0.8, 0.01, (value) => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新透明度');
          return;
        }
        console.log('滑块更新透明度:', value);
        this.sceneManager.updateHologramEffect({
          opacity: value
        });
      } catch (error) {
        console.error('更新透明度失败:', error);
      }
    });
    
    this.hologramSliders.rimIntensity = this.addSlider(section, '边缘发光强度', 0, 5, 1.5, 0.1, (value) => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新边缘发光强度');
          return;
        }
        console.log('滑块更新边缘发光强度:', value);
        this.sceneManager.updateHologramEffect({
          rimIntensity: value
        });
      } catch (error) {
        console.error('更新边缘发光强度失败:', error);
      }
    });
    
    this.hologramSliders.wireframeWidth = this.addSlider(section, '线框宽度', 0, 2, 0.5, 0.01, (value) => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新线框宽度');
          return;
        }
        console.log('滑块更新线框宽度:', value);
        this.sceneManager.updateHologramEffect({
          wireframeWidth: value
        });
      } catch (error) {
        console.error('更新线框宽度失败:', error);
      }
    });
    
    // 添加线框密度滑块
    this.hologramSliders.wireframeDensity = this.addSlider(section, '线框密度', 1, 20, 5, 0.5, (value) => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新线框密度');
          return;
        }
        console.log('滑块更新线框密度:', value);
        this.sceneManager.updateHologramEffect({
          wireframeDensity: value
        });
      } catch (error) {
        console.error('更新线框密度失败:', error);
      }
    });
    
    this.hologramSliders.gridIntensity = this.addSlider(section, '网格强度', 0, 2, 0.2, 0.01, (value) => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新网格强度');
          return;
        }
        console.log('滑块更新网格强度:', value);
        this.sceneManager.updateHologramEffect({
          gridIntensity: value
        });
      } catch (error) {
        console.error('更新网格强度失败:', error);
      }
    });
    
    this.hologramSliders.glitchIntensity = this.addSlider(section, '故障效果强度', 0, 2, 0.5, 0.01, (value) => {
      try {
        if (!this.sceneManager.isHologramEnabled) {
          console.log('全息效果未启用，无法更新故障效果强度');
          return;
        }
        console.log('滑块更新故障效果强度:', value);
        this.sceneManager.updateHologramEffect({
          glitchIntensity: value
        });
      } catch (error) {
        console.error('更新故障效果强度失败:', error);
      }
    });
    
    this.container.appendChild(section);
  }
  
  /**
   * 应用所有全息效果设置
   * 当切换全息效果时调用，确保所有滑块值都被应用
   */
  applyAllHologramSettings() {
    try {
      // 获取颜色值
      const colorInput = this.container.querySelector('input[type="color"]');
      const color = colorInput ? colorInput.value : '#00aaff';
      
      // 构建设置对象
      const settings = {
        color: color
      };
      
      console.log('收集全息效果设置...');
      
      // 获取所有滑块的值
      if (this.hologramSliders) {
        if (this.hologramSliders.opacity) {
          const slider = this.hologramSliders.opacity.querySelector('input[type="range"]');
          if (slider) {
            settings.opacity = parseFloat(slider.value);
            console.log('- 透明度:', settings.opacity);
          }
        }
        
        if (this.hologramSliders.rimIntensity) {
          const slider = this.hologramSliders.rimIntensity.querySelector('input[type="range"]');
          if (slider) {
            settings.rimIntensity = parseFloat(slider.value);
            console.log('- 边缘发光强度:', settings.rimIntensity);
          }
        }
        
        if (this.hologramSliders.wireframeWidth) {
          const slider = this.hologramSliders.wireframeWidth.querySelector('input[type="range"]');
          if (slider) {
            settings.wireframeWidth = parseFloat(slider.value);
            console.log('- 线框宽度:', settings.wireframeWidth);
          }
        }
        
        if (this.hologramSliders.wireframeDensity) {
          const slider = this.hologramSliders.wireframeDensity.querySelector('input[type="range"]');
          if (slider) {
            settings.wireframeDensity = parseFloat(slider.value);
            console.log('- 线框密度:', settings.wireframeDensity);
          }
        }
        
        if (this.hologramSliders.gridIntensity) {
          const slider = this.hologramSliders.gridIntensity.querySelector('input[type="range"]');
          if (slider) {
            settings.gridIntensity = parseFloat(slider.value);
            console.log('- 网格强度:', settings.gridIntensity);
          }
        }
        
        if (this.hologramSliders.glitchIntensity) {
          const slider = this.hologramSliders.glitchIntensity.querySelector('input[type="range"]');
          if (slider) {
            settings.glitchIntensity = parseFloat(slider.value);
            console.log('- 故障效果强度:', settings.glitchIntensity);
          }
        }
      }
      
      console.log('应用全息效果设置:', settings);
      
      // 应用所有设置
      this.sceneManager.updateHologramEffect(settings);
      
      // 显示成功消息
      this.showMessage('全息效果设置已应用', 'success');
    } catch (error) {
      console.error('应用全息效果设置失败:', error);
      this.showMessage('应用全息效果设置失败: ' + error.message, 'error');
    }
  }
  
  /**
   * 重置全息效果滑块到默认值
   */
  resetHologramSliders() {
    try {
      // 重置透明度滑块
      if (this.hologramSliders.opacity) {
        const slider = this.hologramSliders.opacity.querySelector('input[type="range"]');
        const valueDisplay = this.hologramSliders.opacity.querySelector('span:last-child');
        if (slider && valueDisplay) {
          slider.value = 0.22;
          valueDisplay.textContent = '0.22';
        }
      }
      
      // 重置边缘发光强度滑块
      if (this.hologramSliders.rimIntensity) {
        const slider = this.hologramSliders.rimIntensity.querySelector('input[type="range"]');
        const valueDisplay = this.hologramSliders.rimIntensity.querySelector('span:last-child');
        if (slider && valueDisplay) {
          slider.value = 0.40;
          valueDisplay.textContent = '0.40';
        }
      }
      
      // 重置线框宽度滑块
      if (this.hologramSliders.wireframeWidth) {
        const slider = this.hologramSliders.wireframeWidth.querySelector('input[type="range"]');
        const valueDisplay = this.hologramSliders.wireframeWidth.querySelector('span:last-child');
        if (slider && valueDisplay) {
          slider.value = 1.35;
          valueDisplay.textContent = '1.35';
        }
      }
      
      // 重置线框密度滑块
      if (this.hologramSliders.wireframeDensity) {
        const slider = this.hologramSliders.wireframeDensity.querySelector('input[type="range"]');
        const valueDisplay = this.hologramSliders.wireframeDensity.querySelector('span:last-child');
        if (slider && valueDisplay) {
          slider.value = 2.0;
          valueDisplay.textContent = '2.00';
        }
      }
      
      // 重置网格强度滑块
      if (this.hologramSliders.gridIntensity) {
        const slider = this.hologramSliders.gridIntensity.querySelector('input[type="range"]');
        const valueDisplay = this.hologramSliders.gridIntensity.querySelector('span:last-child');
        if (slider && valueDisplay) {
          slider.value = 0.2;
          valueDisplay.textContent = '0.20';
        }
      }
      
      // 重置故障效果强度滑块
      if (this.hologramSliders.glitchIntensity) {
        const slider = this.hologramSliders.glitchIntensity.querySelector('input[type="range"]');
        const valueDisplay = this.hologramSliders.glitchIntensity.querySelector('span:last-child');
        if (slider && valueDisplay) {
          slider.value = 0.03;
          valueDisplay.textContent = '0.03';
        }
      }
      
      console.log('全息效果滑块已重置为默认值');
    } catch (error) {
      console.error('重置滑块失败:', error);
      throw new Error('重置滑块失败: ' + error.message);
    }
  }
  
  /**
   * 创建分区
   * @param {string} title - 分区标题
   * @returns {HTMLElement} - 分区元素
   */
  createSection(title) {
    const section = document.createElement('div');
    section.style.marginBottom = '20px';
    section.style.borderBottom = '1px solid rgba(0, 170, 255, 0.3)';
    section.style.paddingBottom = '10px';
    
    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = title;
    sectionTitle.style.margin = '0 0 10px 0';
    sectionTitle.style.fontSize = '16px';
    sectionTitle.style.color = '#0af';
    section.appendChild(sectionTitle);
    
    return section;
  }
  
  /**
   * 创建按钮
   * @param {string} text - 按钮文本
   * @param {Function} onClick - 点击回调
   * @returns {HTMLElement} - 按钮元素
   */
  createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.backgroundColor = 'rgba(0, 170, 255, 0.2)';
    button.style.color = '#0af';
    button.style.border = '1px solid #0af';
    button.style.borderRadius = '4px';
    button.style.padding = '8px 12px';
    button.style.margin = '0 10px 10px 0';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = 'rgba(0, 170, 255, 0.4)';
    });
    
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = 'rgba(0, 170, 255, 0.2)';
    });
    
    button.addEventListener('click', onClick);
    
    return button;
  }
  
  /**
   * 添加滑块控制
   * @param {HTMLElement} parent - 父元素
   * @param {string} label - 标签文本
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {number} value - 默认值
   * @param {number} step - 步长
   * @param {Function} onChange - 变化回调
   * @returns {HTMLElement} - 滑块容器元素
   */
  addSlider(parent, label, min, max, value, step, onChange) {
    const container = document.createElement('div');
    container.style.marginBottom = '10px';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = `${label}: `;
    labelElement.style.display = 'block';
    labelElement.style.marginBottom = '5px';
    container.appendChild(labelElement);
    
    const sliderContainer = document.createElement('div');
    sliderContainer.style.display = 'flex';
    sliderContainer.style.alignItems = 'center';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = value;
    slider.step = step;
    slider.style.flex = '1';
    slider.style.height = '6px';
    slider.style.borderRadius = '3px';
    slider.style.appearance = 'none';
    slider.style.backgroundColor = 'rgba(0, 170, 255, 0.2)';
    slider.style.outline = 'none';
    
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = value;
    valueDisplay.style.marginLeft = '10px';
    valueDisplay.style.minWidth = '40px';
    valueDisplay.style.textAlign = 'right';
    
    // 使用防抖函数减少频繁更新
    const debouncedOnChange = this.debounce((val) => {
      onChange(val);
    }, 50, label); // 50毫秒防抖，使用标签作为唯一标识
    
    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      valueDisplay.textContent = val.toFixed(2);
      debouncedOnChange(val);
    });
    
    // 添加滑块释放事件，确保最终值被应用
    slider.addEventListener('change', () => {
      const val = parseFloat(slider.value);
      onChange(val);
    });
    
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    container.appendChild(sliderContainer);
    
    parent.appendChild(container);
    
    // 返回容器元素，以便外部引用
    return container;
  }
  
  /**
   * 防抖函数
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间（毫秒）
   * @param {string} id - 唯一标识，用于区分不同的防抖函数
   * @returns {Function} - 防抖后的函数
   */
  debounce(func, wait, id) {
    return (...args) => {
      // 清除之前的定时器
      if (this.debounceTimers[id]) {
        clearTimeout(this.debounceTimers[id]);
      }
      
      // 设置新的定时器
      this.debounceTimers[id] = setTimeout(() => {
        func.apply(this, args);
        delete this.debounceTimers[id];
      }, wait);
    };
  }
  
  /**
   * 处理文件上传
   * @param {Event} event - 事件对象
   */
  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 创建文件URL
    const fileURL = URL.createObjectURL(file);
    
    // 导入模型
    this.importModel(fileURL);
  }
  
  /**
   * 导入模型
   * @param {string} url - 模型URL
   */
  async importModel(url) {
    try {
      // 显示加载中提示
      this.showMessage('正在加载模型...');
      
      // 导入模型
      const { loadGLTFModel } = await import('../utils/modelLoader.js');
      const model = await loadGLTFModel(url);
      
      // 添加到场景，使用默认缩放比例1.0
      if (model) {
        // 获取当前缩放值（如果有滑块的话）
        let scale = 1.0;
        const scaleSlider = this.container.querySelector('input[type="range"][min="0.01"][max="10"]');
        if (scaleSlider) {
          scale = parseFloat(scaleSlider.value);
        }
        
        // 添加模型并设置缩放
        this.sceneManager.addModel(model, { scale: scale });
        this.showMessage('模型加载成功', 'success');
      }
    } catch (error) {
      console.error('模型导入失败:', error);
      this.showMessage('模型导入失败: ' + error.message, 'error');
    }
  }
  
  /**
   * 显示消息
   * @param {string} text - 消息文本
   * @param {string} type - 消息类型 (info, success, error)
   * @param {number} duration - 显示时长（毫秒）
   */
  showMessage(text, type = 'info', duration = 3000) {
    // 移除现有消息
    const existingMessage = document.querySelector('.message-popup');
    if (existingMessage) {
      document.body.removeChild(existingMessage);
    }
    
    // 创建消息元素
    const message = document.createElement('div');
    message.className = 'message-popup';
    
    // 处理多行文本
    if (text.includes('\n')) {
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        if (line.trim()) {
          const lineElement = document.createElement('div');
          lineElement.textContent = line.trim();
          message.appendChild(lineElement);
        }
      });
    } else {
      message.textContent = text;
    }
    
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '2000';
    message.style.fontFamily = 'Arial, sans-serif';
    message.style.transition = 'opacity 0.3s ease';
    message.style.whiteSpace = 'pre-line';
    message.style.textAlign = 'left';
    
    // 设置消息类型样式
    switch (type) {
      case 'success':
        message.style.backgroundColor = 'rgba(0, 170, 0, 0.8)';
        message.style.color = 'white';
        break;
      case 'error':
        message.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        message.style.color = 'white';
        break;
      default:
        message.style.backgroundColor = 'rgba(0, 170, 255, 0.8)';
        message.style.color = 'white';
    }
    
    // 添加到文档
    document.body.appendChild(message);
    
    // 自动移除
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        if (message.parentNode) {
          document.body.removeChild(message);
        }
      }, 300);
    }, duration);
  }
  
  /**
   * 显示控制面板
   */
  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }
  
  /**
   * 隐藏控制面板
   */
  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
  
  /**
   * 切换控制面板显示状态
   */
  toggle() {
    if (this.container) {
      this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
    }
  }
  
  /**
   * 销毁控制面板
   */
  dispose() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    this.container = null;
    this.fileInput = null;
  }
} 
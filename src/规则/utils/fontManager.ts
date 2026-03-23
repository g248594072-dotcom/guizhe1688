/**
 * 字体管理工具
 * 使用系统默认字体，不加载任何外部字体
 */

/** 字体信息接口 */
export interface FontInfo {
  id: string;
  name: string;
  family: string;
  url: string;
  isPreset: boolean;
  previewText?: string;
}

/** 字体设置 */
export interface FontSettings {
  currentFontId: string;
}

/** localStorage 键名 */
const STORAGE_KEY = 'rule_modifier_font_settings';

/** 预设字体列表（仅系统默认字体） */
export const PRESET_FONTS: FontInfo[] = [
  {
    id: 'system-ui',
    name: '系统默认',
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    url: '',
    isPreset: true,
    previewText: '系统默认字体',
  },
  {
    id: 'serif',
    name: '宋体/衬线体',
    family: '"Noto Serif SC", "Source Han Serif SC", "SimSun", "宋体", serif',
    url: '',
    isPreset: true,
    previewText: '宋体衬线体风格',
  },
  {
    id: 'monospace',
    name: '等宽字体',
    family: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", monospace',
    url: '',
    isPreset: true,
    previewText: '等宽字体风格',
  },
];

/** 默认字体设置 */
export const DEFAULT_FONT_SETTINGS: FontSettings = {
  currentFontId: 'system-ui',
};

/**
 * 保存字体设置到 localStorage
 */
export function saveFontSettings(settings: FontSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('⚠️ [fontManager] 保存字体设置失败:', error);
  }
}

/**
 * 从 localStorage 加载字体设置
 */
export function loadFontSettings(): FontSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // 确保加载的字体ID是有效的预设字体
      const validFont = PRESET_FONTS.find((f) => f.id === parsed.currentFontId);
      return {
        currentFontId: validFont ? parsed.currentFontId : DEFAULT_FONT_SETTINGS.currentFontId,
      };
    }
  } catch (error) {
    console.warn('⚠️ [fontManager] 加载字体设置失败:', error);
  }
  return { ...DEFAULT_FONT_SETTINGS };
}

/**
 * 应用字体到文档
 */
export function applyFont(fontId: string): void {
  const font = PRESET_FONTS.find((f) => f.id === fontId) || PRESET_FONTS[0];

  // 移除之前的字体样式标签
  const existingStyle = document.getElementById('rule-modifier-font-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  // 创建新的样式标签
  const style = document.createElement('style');
  style.id = 'rule-modifier-font-style';

  // 应用字体到根元素（但排除 Font Awesome 图标）
  const css = `
    #app-root, #app-root * {
      font-family: ${font.family} !important;
    }

    /* 恢复 Font Awesome 图标字体 */
    #app-root .fa-solid,
    #app-root .fa-regular,
    #app-root .fa-light,
    #app-root .fa-thin,
    #app-root .fa-brands,
    #app-root [class*="fa-"] {
      font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", "FontAwesome", "fontawesome" !important;
    }

    #app-root .fa-solid,
    #app-root .fa-regular {
      font-weight: 900 !important;
    }
  `;

  style.textContent = css;
  document.head.appendChild(style);

  console.log(`✅ [fontManager] 字体已应用: ${font.name}`);
}

/**
 * 应用 Logo 字体（使用系统默认）
 */
export function applyLogoFont(): void {
  // 移除之前的 Logo 字体样式
  const existingStyle = document.getElementById('rule-modifier-logo-font-style');
  if (existingStyle) {
    existingStyle.remove();
  }

  // 创建新的样式标签 - 使用系统字体
  const style = document.createElement('style');
  style.id = 'rule-modifier-logo-font-style';

  const css = `
    .logo-text {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-weight: 600;
    }
  `;

  style.textContent = css;
  document.head.appendChild(style);

  console.log('✅ [fontManager] Logo 字体已应用: 系统默认');
}

/**
 * 初始化字体（加载保存的设置并应用）
 */
export function initFont(): void {
  const settings = loadFontSettings();
  applyFont(settings.currentFontId);
}

/**
 * 获取所有可用字体（预设字体）
 */
export function getAllFonts(): FontInfo[] {
  return [...PRESET_FONTS];
}

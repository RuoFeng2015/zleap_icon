/**
 * Figma Export Configuration
 * 
 * 使用 @figma-export/cli 从 Figma 导出图标
 * 
 * 环境变量：
 * - FIGMA_TOKEN: Figma Personal Access Token
 * - FILE_ID: Figma 文件 ID
 * - PAGE_NAME: 要导出的页面名称（可选，默认导出所有页面）
 */

const { resolve } = require('path');

module.exports = {
  commands: [
    [
      'components',
      {
        fileId: process.env.FILE_ID || 'YOUR_FIGMA_FILE_ID',
        // 只导出特定页面（可选）
        onlyFromPages: process.env.PAGE_NAME ? [process.env.PAGE_NAME] : undefined,
        // 输出目录
        outputters: [
          require('@figma-export/output-components-as-svg')({
            output: resolve(__dirname, 'svg'),
            // 使用 SVGO 优化
            svgo: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      // 保留 viewBox
                      removeViewBox: false,
                      // 禁用颜色转换，保留原始颜色
                      convertColors: false,
                    },
                  },
                },
                'removeDimensions',
                'removeXMLNS',
              ],
            },
          }),
        ],
        // 转换器（可选）
        transformers: [
          require('@figma-export/transform-svg-with-svgo')({
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                    convertColors: false,
                  },
                },
              },
              'removeDimensions',
            ],
          }),
        ],
      },
    ],
  ],
};

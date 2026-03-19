import { useMemo, useState } from 'react'
import { allIcons } from '@zleap-ai/icons'
import spriteRaw from '../../../sprite/icons.svg?raw'

type IconName = keyof typeof allIcons

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toSymbolId(componentName: string): string {
  const clean = componentName.startsWith('Icon')
    ? componentName.slice(4)
    : componentName

  return clean
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function getRawSvgMarkupFromSprite(
  spriteContent: string,
  symbolId: string,
): string | null {
  const id = escapeRegex(symbolId)
  const symbolRegex = new RegExp(
    `<symbol[^>]*id="${id}"[^>]*viewBox="([^"]+)"[^>]*>([\\s\\S]*?)<\\/symbol>`,
    'i',
  )

  const match = spriteContent.match(symbolRegex)
  if (!match) return null

  const viewBox = match[1]
  const content = match[2]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">${content}</svg>`
}

function App() {
  const iconNames = useMemo(
    () => Object.keys(allIcons).sort() as IconName[],
    [],
  )

  const [selectedIcon, setSelectedIcon] = useState<IconName>(
    (iconNames.includes('IconQiChe1' as IconName)
      ? 'IconQiChe1'
      : iconNames[0]) as IconName,
  )
  const [size, setSize] = useState(180)
  const [useColor, setUseColor] = useState(false)
  const [color, setColor] = useState('#111827')
  const [opacity, setOpacity] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [className, setClassName] = useState('')

  const SelectedIconComponent = allIcons[selectedIcon]
  const symbolId = toSymbolId(selectedIcon)
  const rawSvgMarkup = useMemo(
    () => getRawSvgMarkupFromSprite(spriteRaw, symbolId),
    [symbolId],
  )

  const previewStyle = {
    opacity,
    transform: `rotate(${rotate}deg)`,
  }

  return (
    <main className="page">
      <h1>zleap-icon Local Reference Test</h1>
      <p className="desc">
        支持切换任意图标，并实时调组件样式，对比组件渲染与 raw SVG 渲染差异
      </p>

      <section className="controls card">
        <h2>Playground Controls</h2>
        <div className="controls-grid">
          <label>
            图标
            <select
              value={selectedIcon}
              onChange={(e) => setSelectedIcon(e.target.value as IconName)}
            >
              {iconNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label>
            尺寸: {size}px
            <input
              type="range"
              min={16}
              max={280}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </label>

          <label className="inline-label">
            <input
              type="checkbox"
              checked={useColor}
              onChange={(e) => setUseColor(e.target.checked)}
            />
            启用 color prop
          </label>

          <label>
            颜色
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={!useColor}
            />
          </label>

          <label>
            透明度: {opacity.toFixed(2)}
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.01}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
            />
          </label>

          <label>
            旋转: {rotate}°
            <input
              type="range"
              min={-180}
              max={180}
              value={rotate}
              onChange={(e) => setRotate(Number(e.target.value))}
            />
          </label>

          <label className="full-row">
            className
            <input
              type="text"
              placeholder="比如: size-9 text-red-500"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Component Render</h2>
          <div className="preview">
            <SelectedIconComponent
              size={size}
              color={useColor ? color : undefined}
              className={className || undefined}
              style={previewStyle}
            />
          </div>
          <code>{`<${selectedIcon} size={${size}}${
            useColor ? ` color="${color}"` : ''
          } />`}</code>
        </article>

        <article className="card">
          <h2>Raw SVG Render</h2>
          <div className="preview">
            {rawSvgMarkup ? (
              <div
                className="raw-svg"
                style={previewStyle}
                dangerouslySetInnerHTML={{ __html: rawSvgMarkup }}
              />
            ) : (
              <p className="empty-raw">
                在 sprite 中未找到 symbol: <code>{symbolId}</code>
              </p>
            )}
          </div>
          <code>{`symbol id: ${symbolId}`}</code>
        </article>
      </section>

      <p className="hint">
        如果两边视觉不一致，打开 DevTools 对比两边 SVG 的 fill/stroke。
      </p>
    </main>
  )
}

export default App

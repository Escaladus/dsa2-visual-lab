import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { activeRecursionReturn } from '../utils/recursionAlgorithms.js'

const color = n => ({ '--call-fill': `hsl(${(n * 53 + 185) % 360} 34% 21%)`, '--call-stroke': `hsl(${(n * 53 + 185) % 360} 65% 70%)` })
const callName = (kind, node) => `${kind}(${node.n}) #${node.id + 1}`
const clampZoom = value => Math.max(0.15, Math.min(2, value))

export default function RecursionTree({ step, layout, kind, labels }) {
  const scroll = useRef(null), drag = useRef(null), zoomCenter = useRef(null)
  const marker = useId()
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [mode, setMode] = useState('follow')
  const [manualZoom, setManualZoom] = useState(1)
  const extra = labels.enhancements
  const transfer = activeRecursionReturn(step)
  const bounds = useMemo(() => {
    const points = (step.nodes.length ? step.nodes : [{ id: 0 }]).map(node => layout.positions[node.id])
    const left = Math.min(...points.map(p => p.x)) - 42, top = Math.min(...points.map(p => p.y)) - 42
    const right = Math.max(...points.map(p => p.x)) + 42, bottom = Math.max(...points.map(p => p.y)) + 56
    return { x: (left + right) / 2, y: (top + bottom) / 2, width: right - left, height: bottom - top }
  }, [step.nodes, layout])
  const scale = mode === 'fit' ? Math.min(1.2, clampZoom(Math.min((size.width - 24) / bounds.width, (size.height - 24) / bounds.height))) : manualZoom
  const offset = { x: Math.max(0, (size.width - layout.width * scale) / 2), y: Math.max(0, (size.height - layout.height * scale) / 2) }

  useLayoutEffect(() => {
    const element = scroll.current
    const resize = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!size.width || !size.height) return // A mobile tab can be hidden.
    const point = mode === 'follow' ? layout.positions[step.current ?? 0] : mode === 'fit' ? bounds : zoomCenter.current
    if (!point) return
    scroll.current.scrollLeft = Math.max(0, point.x * scale + offset.x - size.width / 2)
    scroll.current.scrollTop = Math.max(0, point.y * scale + offset.y - size.height / 2)
    zoomCenter.current = null
  }, [mode, scale, size.width, size.height, offset.x, offset.y, layout, step.current, bounds])

  function zoomBy(factor) {
    zoomCenter.current = { x: (scroll.current.scrollLeft + size.width / 2 - offset.x) / scale, y: (scroll.current.scrollTop + size.height / 2 - offset.y) / scale }
    setManualZoom(clampZoom(scale * factor))
    setMode('manual')
  }
  const from = transfer && layout.positions[transfer.from]
  const to = transfer?.to != null && layout.positions[transfer.to]
  const distance = to ? Math.hypot(to.x - from.x, to.y - from.y) : 1
  const along = fraction => ({ x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction })
  const start = to && along(29 / distance), end = to && along(1 - 31 / distance)

  return <div className="recursion-tree-view" data-view-mode={mode} data-zoom={scale}>
    <div className="recursion-tree-toolbar" role="group" aria-label={extra.treeControls}>
      <button onClick={() => zoomBy(1 / 1.2)} disabled={scale <= 0.15} aria-label={extra.zoomOut}>−</button>
      <output aria-label={extra.zoom}>{Math.round(scale * 100)}%</output>
      <button onClick={() => zoomBy(1.2)} disabled={scale >= 2} aria-label={extra.zoomIn}>+</button>
      <button aria-pressed={mode === 'fit'} onClick={() => setMode('fit')}>{extra.fitTree}</button>
      <button onClick={() => { setManualZoom(1); setMode('follow') }}>{extra.focusCall}</button>
      <label><input type="checkbox" checked={mode === 'follow'} onChange={event => { setManualZoom(scale); setMode(event.target.checked ? 'follow' : 'manual') }} />{extra.followCall}</label>
    </div>
    <div className="recursion-tree-scroll" ref={scroll} tabIndex={0} aria-label={extra.panTree}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return
        drag.current = { x: event.clientX, y: event.clientY, left: scroll.current.scrollLeft, top: scroll.current.scrollTop }
        scroll.current.setPointerCapture(event.pointerId)
        setManualZoom(scale); setMode('manual')
      }}
      onPointerMove={event => {
        if (!drag.current) return
        scroll.current.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
        scroll.current.scrollTop = drag.current.top - (event.clientY - drag.current.y)
      }}
      onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <div className="recursion-tree-canvas" style={{ width: Math.max(size.width, layout.width * scale), height: Math.max(size.height, layout.height * scale) }}>
        <svg className="recursion-tree" width={layout.width * scale} height={layout.height * scale} style={{ left: offset.x, top: offset.y }} viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={labels.tree}>
          <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-2)" /></marker></defs>
          {step.nodes.filter(node => node.parent !== null).map(node => {
            const parent = layout.positions[node.parent], child = layout.positions[node.id]
            return <line key={node.id} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} className={step.stack.includes(node.id) ? 'recursion-edge active' : 'recursion-edge'} />
          })}
          {to && <g className="recursion-transfer-arrow" aria-label={`${callName(kind, step.nodes[transfer.from])} → ${transfer.value} → ${callName(kind, step.nodes[transfer.to])}`}>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} markerEnd={`url(#${marker})`} />
            <text x={(start.x + end.x) / 2 + 12} y={(start.y + end.y) / 2} dy=".35em">{transfer.value}</text>
          </g>}
          {step.nodes.map(node => {
            const point = layout.positions[node.id]
            return <g key={node.id} data-call-id={node.id} data-n={node.n} className={`recursion-node ${node.status} ${step.current === node.id ? 'current' : ''} ${transfer?.to === node.id ? 'receiving' : ''} ${node.cached ? 'cached' : ''}`} style={color(node.n)} transform={`translate(${point.x},${point.y})`}>
              <title>{callName(kind, node)}{node.cached ? ` · ${extra.cached}` : ''}</title><circle r="27" />
              <text textAnchor="middle" dy=".35em">{kind === 'factorial' ? 'fact' : 'fib'}({node.n})</text>
              <text className="recursion-call-id" textAnchor="middle" y="-32">#{node.id + 1}{node.cached ? ' ✓' : ''}</text>
              {node.result !== null && <text className="recursion-node-result" textAnchor="middle" y="45">= {node.result}</text>}
            </g>
          })}
        </svg>
      </div>
    </div>
  </div>
}

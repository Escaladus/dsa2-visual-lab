import { useLayoutEffect, useRef, useState } from 'react'
import { formatMessage } from '../i18n/index.js'

// Scroll only this viewport. Changing a level must never scroll the surrounding page.
export default function RecurrenceTreeViewport({ model, level, zoom, resetView, labels }) {
  const viewport = useRef(null)
  const previous = useRef(null)
  const drag = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const offsetX = Math.max(0, (size.width - model.width * zoom) / 2)
  const offsetY = Math.max(0, (size.height - model.height * zoom) / 2)
  const shown = model.nodes.filter(node => node.depth <= level)

  useLayoutEffect(() => {
    const element = viewport.current
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const element = viewport.current
    const old = previous.current
    if (!size.width || !size.height) {
      return
    }
    if (
      !old ||
      old.model !== model ||
      old.resetView !== resetView ||
      (level === 0 && old.level !== 0)
    ) {
      element.scrollLeft = Math.max(0, model.nodes[0].x * zoom + offsetX - size.width / 2)
      element.scrollTop = 0
    } else if (old.zoom !== zoom || old.width !== size.width || old.height !== size.height) {
      // Keep the user's view centre when changing scale or viewport dimensions.
      // Convert the old screen centre back to tree coordinates before applying the new scale.
      const x = (element.scrollLeft + old.width / 2 - old.offsetX) / old.zoom
      const y = (element.scrollTop + old.height / 2 - old.offsetY) / old.zoom
      element.scrollLeft = Math.max(0, x * zoom + offsetX - size.width / 2)
      element.scrollTop = Math.max(0, y * zoom + offsetY - size.height / 2)
    }
    // Reveal the new row inside the diagram without moving the page or changing horizontal position.
    if (!old || old.model !== model || old.level !== level) {
      const y = (48 + level * 88) * zoom + offsetY
      if (y + 32 * zoom > element.scrollTop + size.height - 16) {
        element.scrollTop = y + 32 * zoom - size.height + 16
      } else if (y - 32 * zoom < element.scrollTop) {
        element.scrollTop = Math.max(0, y - 32 * zoom - 12)
      }
    }
    previous.current = {
      model,
      zoom,
      level,
      resetView,
      width: size.width,
      height: size.height,
      offsetX,
      offsetY,
    }
  }, [model, zoom, level, resetView, size.width, size.height, offsetX, offsetY])

  return (
    <div
      className="rt-scroll"
      ref={viewport}
      role="region"
      tabIndex={0}
      aria-label={labels.pan}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
          return
        }
        event.preventDefault()
        event.currentTarget.focus({ preventScroll: true })
        drag.current = {
          x: event.clientX,
          y: event.clientY,
          left: viewport.current.scrollLeft,
          top: viewport.current.scrollTop,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={event => {
        if (!drag.current) {
          return
        }
        viewport.current.scrollLeft = drag.current.left + drag.current.x - event.clientX
        viewport.current.scrollTop = drag.current.top + drag.current.y - event.clientY
      }}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
    >
      <div
        className="rt-canvas"
        style={{
          width: Math.max(size.width, model.width * zoom),
          height: Math.max(size.height, model.height * zoom),
        }}
      >
        <svg
          width={model.width * zoom}
          height={model.height * zoom}
          viewBox={`0 0 ${model.width} ${model.height}`}
          style={{ left: offsetX, top: offsetY }}
          role="img"
          aria-label={labels.tree}
        >
          {shown
            .filter(node => node.parent !== null)
            .map(node => {
              const parent = model.nodes[node.parent]
              return (
                <line
                  key={node.id}
                  className={`rt-edge ${node.depth === level ? 'current' : ''}`}
                  x1={parent.x}
                  y1={parent.y + 25}
                  x2={node.x}
                  y2={node.y - 25}
                />
              )
            })}
          {shown.map(node => (
            <g
              key={node.id}
              className={`rt-node ${node.depth === level ? 'current' : ''}`}
              transform={`translate(${node.x},${node.y})`}
              data-node-id={node.id}
              data-depth={node.depth}
              data-size={node.size}
              data-work={node.work}
            >
              <title>
                {formatMessage(labels.node, {
                  size: node.size,
                  work: node.work,
                  depth: node.depth,
                })}
              </title>
              <rect x="-44" y="-25" width="88" height="50" rx="10" />
              <text textAnchor="middle" y="-3">
                T({node.size})
              </text>
              <text className="rt-node-work" textAnchor="middle" y="15">
                {formatMessage(labels.nodeWork, { work: node.work })}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

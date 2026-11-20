import { useMemo, useState } from 'react'

import { treeExamples } from '../data/treeTraversal.js'
import { createTreeTraversalSteps, treeStats } from '../utils/treeTraversal.js'
import {
  treeTraversalCode,
  treeCreationCode,
  treeSizeCode,
  treeHeightCode,
  generalTreeCode,
} from '../data/treeTraversalCode.js'
import { treeTranslations } from '../i18n/trees.js'
import { traJavadocBase } from '../data/graphBasics.js'
import ExecutionCode from './ExecutionCode.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function TreeTraversalLab() {
  const { text, message, language } = useLanguage()
  const labels = treeTranslations[language]
  const [preset, setPreset] = useState('balanced')
  const [type, setType] = useState('pre')
  const [index, setIndex] = useState(0)
  const tree = treeExamples[preset]
  const nodes = tree.nodes
  const edges = Object.entries(nodes).flatMap(([id, node]) =>
    [node.left, node.right].filter(child => child !== null).map(child => [id, child]),
  )
  const stats = useMemo(() => treeStats(tree), [tree])
  const steps = useMemo(() => createTreeTraversalSteps(tree, type), [tree, type])
  const step = steps[index] ?? null
  const done = new Set(step?.processed ?? [])

  function choose(nextPreset, nextType) {
    if (nextPreset === preset && nextType === type) return
    setPreset(nextPreset)
    setType(nextType)
    setIndex(0)
  }

  return (
    <section
      className="lab-shell tree-traversal-lab"
      data-preset={preset}
      data-order={type}
      data-step={index}
    >
      <p className="recursion-description">{labels.intro}</p>
      <div className="lab-toolbar">
        <label>
          {labels.example}
          <select value={preset} onChange={event => choose(event.target.value, type)}>
            {Object.keys(treeExamples).map(key => (
              <option key={key} value={key}>
                {labels.examples[key]}
              </option>
            ))}
          </select>
        </label>
        <div className="segmented three">
          <button
            className={type === 'pre' ? 'selected' : ''}
            aria-pressed={type === 'pre'}
            onClick={() => choose(preset, 'pre')}
          >
            PRE
          </button>
          <button
            className={type === 'in' ? 'selected' : ''}
            aria-pressed={type === 'in'}
            onClick={() => choose(preset, 'in')}
          >
            IN
          </button>
          <button
            className={type === 'post' ? 'selected' : ''}
            aria-pressed={type === 'post'}
            onClick={() => choose(preset, 'post')}
          >
            POST
          </button>
        </div>
      </div>
      <dl className="tree-metrics">
        <div>
          <dt>{labels.size}</dt>
          <dd>{stats.size}</dd>
        </div>
        <div>
          <dt>{labels.height}</dt>
          <dd>{stats.height}</dd>
        </div>
        <div>
          <dt>{labels.levels}</dt>
          <dd>{stats.levels}</dd>
        </div>
      </dl>
      <div className="tree-grid">
        <svg
          className="tree-svg"
          viewBox="0 0 100 82"
          role="img"
          aria-label={`${text.ui.tree}: ${labels.examples[preset]}`}
        >
          {tree.root === null && (
            <text x="50" y="40" textAnchor="middle" className="tree-empty">
              root = null
            </text>
          )}
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
            />
          ))}
          {Object.entries(nodes).map(([k, p]) => (
            <g
              key={k}
              data-tree-node={k}
              data-depth={step?.current === k ? step.depth : undefined}
              className={`tree-node ${k === step?.current ? 'current' : done.has(k) ? 'done' : ''}`}
            >
              <circle cx={p.x} cy={p.y} r="7" />
              <text x={p.x} y={p.y + 1.3} textAnchor="middle">
                {p.value}
              </text>
            </g>
          ))}
        </svg>
        <div className="state-panel">
          <div className="step-badge">
            {text.ui.step} {step ? index + 1 : 0} / {steps.length}
          </div>
          <h3>{text.ui.result}</h3>
          <div className="order-pills">
            {(step?.order ?? []).map((v, i) => (
              <span key={`${v}-${i}`}>{v}</span>
            ))}
          </div>
          <div className="explanation-box">
            {step ? message(step.message, { v: step.value }) : labels.empty}
          </div>
          {step && (
            <dl className="tree-current-metrics">
              <div>
                <dt>{labels.depth}</dt>
                <dd>{step.depth}</dd>
              </div>
              <div>
                <dt>{labels.frames}</dt>
                <dd>{step.nodeFrames}</dd>
              </div>
              <div>
                <dt>{labels.path}</dt>
                <dd>{step.path.map(id => nodes[id].value).join(' → ')}</dd>
              </div>
            </dl>
          )}
          <div className="mini-rule">
            {type === 'pre' && (
              <>
                <b>PRE:</b> {text.ui.root} → {text.ui.left} → {text.ui.right}
              </>
            )}
            {type === 'in' && (
              <>
                <b>IN:</b> {text.ui.left} → {text.ui.root} → {text.ui.right}
              </>
            )}
            {type === 'post' && (
              <>
                <b>POST:</b> {text.ui.left} → {text.ui.right} → {text.ui.root}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="playback">
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>
          {text.ui.back}
        </button>
        <button
          className="primary"
          onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))}
          disabled={!step || index === steps.length - 1}
        >
          {text.ui.next}
        </button>
        <button onClick={() => setIndex(0)}>{text.ui.reset}</button>
      </div>
      <p className="recursion-note">{labels.frameNote}</p>
      <details className="adjacency-box tree-java">
        <summary>{labels.java}</summary>
        <p>{labels.javaNote}</p>
        <ExecutionCode code={treeTraversalCode} line={step?.line ?? 2} label={labels.java} />
      </details>
      <details className="adjacency-box tree-explanation">
        <summary>{labels.explanation}</summary>
        {labels.points.map(([title, body]) => (
          <section key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </section>
        ))}
        <h3>{labels.creation}</h3>
        <pre className="code-block" tabIndex={0}>
          <code>{treeCreationCode}</code>
        </pre>
        <h3>{labels.sizeHeight}</h3>
        <pre className="code-block" tabIndex={0}>
          <code>{treeSizeCode + '\n\n' + treeHeightCode}</code>
        </pre>
        <h3>{labels.general}</h3>
        <pre className="code-block" tabIndex={0}>
          <code>{generalTreeCode}</code>
        </pre>
        <div className="table-wrap">
          <table className="graph-basics-api">
            <tbody>
              {Object.entries(labels.api).map(([name, description]) => (
                <tr key={name}>
                  <th scope="row">
                    <a href={`${traJavadocBase}${name}.html`} target="_blank" rel="noreferrer">
                      {name}
                    </a>
                  </th>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}

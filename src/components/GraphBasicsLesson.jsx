import { useId } from 'react'
import {
  graphBasicsApi,
  graphBasicsExample,
  graphConstructionExcerpt,
  traJavadocBase,
} from '../data/graphBasics.js'
import { graphBasicsTranslations } from '../i18n/graphBasics.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import graphSource from '../tra-examples/TraGraphExample.java?raw'

const construction = graphConstructionExcerpt(graphSource)
const { vertices, edges } = graphBasicsExample
const adjacency = vertices
  .map(
    vertex =>
      `${vertex.label}: [${edges
        .filter(edge => edge.from === vertex.label)
        .map(edge => edge.to)
        .join(', ')}]`,
  )
  .join('\n')

function GraphDrawing({ label }) {
  const id = useId()
  return (
    <svg className="graph-basics-svg" viewBox="0 0 330 225" role="img" aria-label={label}>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      {edges.map(edge => {
        const from = vertices.find(vertex => vertex.label === edge.from)
        const to = vertices.find(vertex => vertex.label === edge.to)
        const distance = Math.hypot(to.x - from.x, to.y - from.y)
        const dx = (to.x - from.x) / distance
        const dy = (to.y - from.y) / distance
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line
              x1={from.x + dx * 23}
              y1={from.y + dy * 23}
              x2={to.x - dx * 27}
              y2={to.y - dy * 27}
              markerEnd={`url(#${id})`}
            />
            <text
              className="graph-basics-weight"
              x={(from.x + to.x) / 2 + dy * 18}
              y={(from.y + to.y) / 2 - dx * 18 + 5}
              textAnchor="middle"
            >
              {edge.weight}
            </text>
          </g>
        )
      })}
      {vertices.map(vertex => (
        <g key={vertex.label} className={vertex.label === 'D' ? 'isolated' : ''}>
          <circle cx={vertex.x} cy={vertex.y} r="22" />
          <text x={vertex.x} y={vertex.y + 6} textAnchor="middle">
            {vertex.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function GraphBasicsLesson() {
  const { language } = useLanguage()
  const labels = graphBasicsTranslations[language]
  const id = useId()
  return (
    <section className="graph-basics-lesson" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{labels.title}</h2>
      <p>{labels.intro}</p>
      <div className="graph-basics-grid">
        <figure>
          <GraphDrawing label={labels.drawing} />
          <figcaption>{labels.readDrawing}</figcaption>
          <h3>{labels.neighbors}</h3>
          <pre className="code-block" tabIndex={0}>
            <code>{adjacency}</code>
          </pre>
          <p>{labels.readNeighbors}</p>
        </figure>
        <div className="graph-basics-construction">
          <h3>{labels.construction}</h3>
          <p>{labels.source}</p>
          <pre
            className="code-block"
            tabIndex={0}
            aria-label="TraGraphExample.java: createDirectedGraph"
          >
            <code>{construction}</code>
          </pre>
          <p>{labels.edgeWeight}</p>
        </div>
      </div>
      <h3>{labels.apiTitle}</h3>
      <div className="table-wrap">
        <table className="graph-basics-api">
          <thead>
            <tr>
              <th>{labels.apiClass}</th>
              <th>{labels.apiUse}</th>
            </tr>
          </thead>
          <tbody>
            {graphBasicsApi.map(name => (
              <tr key={name}>
                <th scope="row">
                  <a href={`${traJavadocBase}${name}.html`} target="_blank" rel="noreferrer">
                    {name}
                  </a>
                </th>
                <td>{labels.api[name]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hint">{labels.documentation}</p>
    </section>
  )
}

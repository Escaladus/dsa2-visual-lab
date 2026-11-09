import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function count(n, type) {
  if (type === 'O(1)') return 1
  if (type === 'O(log n)') return Math.ceil(Math.log2(n))
  if (type === 'O(n)') return n
  if (type === 'O(n log n)') return Math.ceil(n * Math.log2(n))
  return n * n
}

export default function ComplexityLab() {
  const { text, locale } = useLanguage()
  const [n, setN] = useState(10000)
  return (
    <div className="lab-shell">
      <div className="number-control">
        <label>{text.ui.inputN} <input type="number" min="1" max="1000000" value={n} onChange={e => setN(Math.min(1000000, Math.max(1, Number(e.target.value) || 1)))} /></label>
      </div>
      <div className="table-wrap">
        <table className="complexity-table">
          <thead><tr><th>Big O</th><th>{text.ui.name}</th><th>{text.ui.example}</th><th>{text.ui.operations}{n.toLocaleString(locale)}</th></tr></thead>
          <tbody>{text.complexityRows.map(([o, name, example]) => <tr key={o}><td><code>{o}</code></td><td>{name}</td><td>{example}</td><td>{count(n, o).toLocaleString(locale)}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="hint">{text.ui.complexityHint}</p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import TopicNav from './components/TopicNav.jsx'
import ConceptCard from './components/ConceptCard.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import GraphLab from './components/GraphLab.jsx'
import TreeTraversalLab from './components/TreeTraversalLab.jsx'
import SortingLab from './components/SortingLab.jsx'
import ComplexityLab from './components/ComplexityLab.jsx'
import JavaExamples from './components/JavaExamples.jsx'
import { handout, handoutSections } from './data/handout.js'
import { sortingAlgorithms } from './utils/sortingAlgorithms.js'
import { roadmapIds, topics } from './data/topics.js'
import { useLanguage } from './i18n/LanguageContext.jsx'

function Code({ children }) {
  return <pre className="code-block"><code>{children}</code></pre>
}

// Inline code stays text, including Java generics such as List<T>.
function InlineText({ children }) {
  return children.split(/(`[^`]+`)/g).map((part, index) =>
    part.startsWith('`') ? <code key={index}>{part.slice(1, -1)}</code> : part,
  )
}

function SortingTable() {
  const { text } = useLanguage()
  return (
    <div className="table-wrap">
      <table className="complexity-table">
        <thead><tr><th>{text.ui.algorithm}</th><th>{text.ui.average}</th><th>{text.ui.idea}</th></tr></thead>
        <tbody>{sortingAlgorithms.map(({ id, average }, index) => (
          <tr key={id}><td>{text.sorting.algorithms[id].name}</td><td>{average}</td><td>{text.sortingIdeas[index]}</td></tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function Lesson({ topic, onOpen }) {
  const { text } = useLanguage()
  const { id } = topic
  const page = text.pages[id]
  const reference = handoutSections[id]
  const grid = id === 'trees' ? 'cards-3' : ['sets-maps', 'graph-apps', 'java-tools'].includes(id) ? 'cards-2' : ''

  return <>
    <header className="page-title">
      <span>{id === 'overview' ? 'DSA2' : text.groups[topic.group]}</span>
      <h1>{page.title}</h1>
      <p>{page.intro}</p>
    </header>
    <div className="handout-reference"><strong>{text.ui.handout}</strong><span>{handout.filename} · § {reference.section} · {text.ui.handoutPages} {reference.pages}</span></div>

    {id === 'overview' && <div className="roadmap">{text.roadmap.map(([title, description], index) => (
      <button key={roadmapIds[index]} onClick={() => onOpen(roadmapIds[index])}>
        <span>{index + 1}</span><div><b>{title}</b><small>{description}</small></div>
      </button>
    ))}</div>}
    {id === 'complexity' && <ComplexityLab />}
    {id === 'trees' && <TreeTraversalLab />}
    {id === 'sorting' && <><SortingLab /><SortingTable /></>}
    {(id === 'graph-dfs' || id === 'graph-bfs') && <GraphLab initialMode={id === 'graph-dfs' ? 'dfs' : 'bfs'} />}

    <div className={grid}>{page.cards.map(([title, body], index) => (
      <ConceptCard key={index} title={title} accent={index === 0 && ['overview', 'sorted-lists', 'graph-dfs', 'graph-bfs'].includes(id)}>
        {id === 'graph-basics' && index === 2 && <Code>{'A: [B, C]\nB: [A, D, F]\nC: [A, D, E]\n...'}</Code>}
        {Array.isArray(body)
          ? <ul>{body.map((item, i) => <li key={i}><InlineText>{item}</InlineText></li>)}</ul>
          : <p><InlineText>{body}</InlineText></p>}
      </ConceptCard>
    ))}</div>

    {id === 'graph-basics' && <div className="callout-actions">
      <button onClick={() => onOpen('graph-dfs')}>{text.ui.goDfs}</button>
      <button onClick={() => onOpen('graph-bfs')}>{text.ui.goBfs}</button>
    </div>}
    <JavaExamples topicId={id} />
  </>
}

export default function App() {
  const { text } = useLanguage()
  const [active, setActive] = useState(() => location.hash.slice(1) || 'overview')
  const [menuOpen, setMenuOpen] = useState(false)
  const current = topics.find(topic => topic.id === active) ?? topics[0]

  function open(id) {
    setActive(id)
    location.hash = id
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleHash = () => setActive(location.hash.slice(1) || 'overview')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return <div className="app-layout">
    <div className={`mobile-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />
    <div id="topic-sidebar" className={`sidebar-wrap ${menuOpen ? 'open' : ''}`}><TopicNav active={current.id} onSelect={open} /></div>
    <main className="content">
      <div className="content-top">
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="topic-sidebar" onClick={() => setMenuOpen(value => !value)}>☰ {text.ui.topics}</button>
        <strong className="mobile-brand">DSA2 Visual Lab</strong>
        <LanguageSwitcher />
      </div>
      <div className="content-inner"><Lesson key={current.id} topic={current} onOpen={open} /></div>
      <footer>
        <p>{text.ui.footer} <a href="https://github.com/Escaladus">Denis</a></p>
        <p>{text.ui.courseCredit}</p>
      </footer>
    </main>
  </div>
}

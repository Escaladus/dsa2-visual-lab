import { topics } from '../data/topics.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function TopicNav({ active, onSelect }) {
  const { text } = useLanguage()
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">D2</div>
        <div>
          <strong>DSA2 Visual Lab</strong>
          <span>{text.ui.examples}</span>
        </div>
      </div>

      <nav aria-label={text.ui.topics}>
        {text.groups.map((group, groupIndex) => (
          <div className="nav-group" key={group}>
            <div className="nav-group-title">{group}</div>
            {topics.map((topic, index) => ({ ...topic, title: text.topics[index][0], short: text.topics[index][1] })).filter(t => t.group === groupIndex).map(topic => (
              <button
                key={topic.id}
                className={`nav-item ${active === topic.id ? 'active' : ''}`}
                onClick={() => onSelect(topic.id)}
              >
                <span>{topic.title}</span>
                <small>{topic.short}</small>
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default function RecursionTabs({ id, tabs, value, onChange, label, className = '' }) {
  return <div className={`recursion-mobile-tabs ${className}`} role="tablist" aria-label={label}>
    {tabs.map(([key, title], index) => <button key={key} id={`${id}-tab-${key}`} role="tab" aria-selected={value === key} aria-controls={`${id}-${key}`} tabIndex={value === key ? 0 : -1} onClick={() => onChange(key)} onKeyDown={event => {
      let next
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = tabs.length - 1
      if (next === undefined) return
      event.preventDefault()
      onChange(tabs[next][0])
      event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus()
    }}>{title}</button>)}
  </div>
}

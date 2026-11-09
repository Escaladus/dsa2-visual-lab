export default function ConceptCard({ title, children, accent = false }) {
  return (
    <section className={`concept-card ${accent ? 'accent' : ''}`}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

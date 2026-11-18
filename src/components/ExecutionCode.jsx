import { useEffect, useRef } from 'react'

export default function ExecutionCode({ code, line, label, resume, caption = resume?.caption }) {
  const scroll = useRef(null)
  useEffect(() => {
    const element = scroll.current
    const center = () => {
      const active = element.querySelector('.current')
      if (active && element.clientHeight) {
        element.scrollTop = Math.max(
          0,
          active.offsetTop - element.clientHeight / 2 + active.offsetHeight / 2,
        )
      }
    }
    center()
    const observer = new ResizeObserver(center)
    observer.observe(element)
    return () => observer.disconnect()
  }, [line, code])
  return (
    <>
      <pre ref={scroll} className="code-block recursion-code" tabIndex={0} aria-label={label}>
        <code>
          {code.split('\n').map((source, i) => (
            <span
              key={i}
              data-line={i + 1}
              data-resume-call-id={resume?.line === i + 1 ? resume.id : undefined}
              title={resume?.line === i + 1 ? caption : undefined}
              className={`recursion-code-line ${line === i + 1 ? 'current' : ''} ${resume?.line === i + 1 ? 'resume-point' : ''}`}
            >
              <span aria-hidden="true">{i + 1}</span>
              <span>{source}</span>
              {resume?.line === i + 1 && (
                <b className="recursion-resume-marker" aria-hidden="true">
                  ↩
                </b>
              )}
            </span>
          ))}
        </code>
      </pre>
      {caption && <p className="recursion-resume-caption">{caption}</p>}
    </>
  )
}

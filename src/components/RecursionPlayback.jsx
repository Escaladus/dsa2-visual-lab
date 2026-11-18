export default function RecursionPlayback({
  index,
  count,
  playing,
  speed,
  onSeek,
  onToggle,
  onReset,
  onSpeed,
  labels,
  ui,
}) {
  const last = count - 1
  return (
    <div className="recursion-bottom-controls" role="group" aria-label={labels.controls}>
      <div className="recursion-controls-main">
        <div className="playback">
          <button disabled={index === 0} onClick={() => onSeek(index - 1)}>
            {ui.back}
          </button>
          <button onClick={onToggle}>{playing ? ui.pause : ui.play}</button>
          <button className="primary" disabled={index === last} onClick={() => onSeek(index + 1)}>
            {ui.next}
          </button>
        </div>
        <details
          className="recursion-control-options"
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.currentTarget.open = false
              event.currentTarget.querySelector('summary').focus()
            }
          }}
        >
          <summary aria-label={labels.moreControls} title={labels.moreControls}>
            ⋯
          </summary>
          <div className="recursion-options-popover">
            <button
              disabled={index === last}
              onClick={event => {
                event.currentTarget.closest('details').open = false
                onSeek(last)
              }}
            >
              {labels.finish}
            </button>
            <button
              onClick={event => {
                event.currentTarget.closest('details').open = false
                onReset()
              }}
            >
              {labels.reset}
            </button>
            <label className="sorting-speed">
              {ui.speed}
              <input
                type="range"
                min="200"
                max="1600"
                step="100"
                value={speed}
                onChange={event => onSpeed(Number(event.target.value))}
              />
            </label>
          </div>
        </details>
      </div>
      <div className="sorting-timeline">
        <span className="step-text">
          {ui.step} {index + 1} / {count}
        </span>
        <input
          type="range"
          min="0"
          max={last}
          value={index}
          aria-label={labels.timeline}
          onChange={event => onSeek(Number(event.target.value))}
        />
      </div>
    </div>
  )
}

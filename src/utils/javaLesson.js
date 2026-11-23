/** Read the teaching region from the actual downloadable Java source. */
export function javaLessonExcerpt(source) {
  const lines = source.split('\n')
  const starts = lines.flatMap((line, index) => (line.trim() === '// lesson:start' ? [index] : []))
  const ends = lines.flatMap((line, index) => (line.trim() === '// lesson:end' ? [index] : []))
  if (starts.length !== 1 || ends.length !== 1 || ends[0] <= starts[0] + 1) {
    throw new Error('Expected one nonempty Java lesson region')
  }
  const excerpt = lines.slice(starts[0] + 1, ends[0])
  const indentation = Math.min(
    ...excerpt.filter(line => line.trim()).map(line => line.match(/^ */)[0].length),
  )
  return excerpt.map(line => line.slice(indentation)).join('\n')
}

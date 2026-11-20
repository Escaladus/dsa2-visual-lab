// Stable lesson IDs match the separately constructed Vertex objects in the Java example.
export const graphBasicsExample = {
  vertices: [
    { label: 'A', x: 45, y: 110 },
    { label: 'B', x: 150, y: 45 },
    { label: 'C', x: 150, y: 180 },
    { label: 'D', x: 285, y: 110 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 5 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
  ],
}

export const graphBasicsApi = ['Graph', 'DiGraph', 'Vertex', 'Edge', 'AbstractGraph']
export const traJavadocBase = 'https://cs.uef.fi/pages/sjuva/trajavadoc2017/fi/uef/cs/tra/'

/** Display the actual construction method rather than maintaining a second Java snippet. */
export function graphConstructionExcerpt(source) {
  const lines = source.split('\n')
  const start = lines.findIndex(line =>
    line.includes('public static DiGraph createDirectedGraph()'),
  )
  const end = lines.findIndex((line, index) => index > start && line === '    }')
  if (start < 0 || end < 0) throw new Error('Missing TRA graph construction method')
  return lines
    .slice(start, end + 1)
    .map(line => line.replace(/^ {4}/, ''))
    .join('\n')
}

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'

const root = new URL('../', import.meta.url)
const source = await readFile(new URL('src/examples/GraphTraversalExample.java', root), 'utf8')
const destination = new URL('src/data/graphTraversalCode.js', root)
const methods = {
  traverseTraversalCode: 'static State traverse(',
  dfsTraversalCode: 'static void dfs(',
  bfsTraversalCode: 'static void bfs(',
  classifyTraversalCode: 'static String classify(',
  topologicalTraversalCode: 'static List<Integer> topological(',
}

// Java methods are indented four spaces. Their closing brace has exactly that indentation;
// inner blocks use eight or more spaces. Preserve every line for execution highlighting.
function extractMethod(signature) {
  const lines = source.split('\n')
  const start = lines.findIndex(line => line.trimStart().startsWith(signature))
  if (start < 0) throw new Error(`Missing Java method: ${signature}`)
  const end = lines.findIndex((line, index) => index > start && line === '    }')
  if (end < 0) throw new Error(`Missing closing brace: ${signature}`)
  return lines
    .slice(start, end + 1)
    .map(line => line.replace(/^ {4}/, ''))
    .join('\n')
}

let generated =
  '// Generated from GraphTraversalExample.java. Edit the Java source, then run npm run sync:java-snippets.\n'
for (const [name, signature] of Object.entries(methods)) {
  const snippet = extractMethod(signature).replaceAll('`', '\\`').replaceAll('${', '\\${')
  generated += `export const ${name} = \`${snippet}\`\n\n`
}
const filepath = fileURLToPath(destination)
generated = await format(generated, { ...(await resolveConfig(filepath)), filepath })
if (process.argv.includes('--check')) {
  if ((await readFile(destination, 'utf8')) !== generated) {
    throw new Error('Java snippets are outdated. Run npm run sync:java-snippets.')
  }
  console.log('Java snippets match their source.')
} else {
  await writeFile(destination, generated)
  console.log('Updated graph traversal Java snippets.')
}

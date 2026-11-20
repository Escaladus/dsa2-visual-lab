import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { format, resolveConfig } from 'prettier'

const root = new URL('../', import.meta.url)
const targets = [
  {
    source: 'TraTraversalExample.java',
    destination: 'graphTraversalCode.js',
    methods: {
      traverseTraversalCode: 'public static State traverse(',
      dfsTraversalCode: 'static void dfs(',
      bfsTraversalCode: 'static void bfs(',
      classifyTraversalCode: 'static String classify(',
      topologicalTraversalCode: 'public static List<Vertex> topological(',
      traversalPreparationCode: 'State(AbstractGraph graph,',
    },
  },
  {
    source: 'TraRecursiveDfsExample.java',
    destination: 'recursiveDfsCode.js',
    methods: { dfsCode: 'static void dfs(', dfsDriverCode: 'public static Result traverse(' },
  },
  {
    source: 'TraBfsExample.java',
    destination: 'basicBfsCode.js',
    methods: { basicBfsCode: 'public static Result search(' },
  },
  {
    source: 'TraTreeExample.java',
    destination: 'treeTraversalCode.js',
    methods: {
      treeTraversalCode: 'public static <E> void traverse(',
      treeCreationCode: 'public static BTree<String> createExampleTree(',
      treeSizeCode: 'public static int size(',
      treeHeightCode: 'public static int height(',
      generalTreeCode: 'public static Tree<String> createGeneralTree(',
    },
  },
]

// Java methods are indented four spaces. Their closing brace has exactly that indentation;
// inner blocks use eight or more spaces. Preserve every line for execution highlighting.
function extractMethod(source, signature) {
  const lines = source.split('\n')
  const start = lines.findIndex(line => line.trimStart().startsWith(signature))
  if (start < 0) throw new Error(`Missing Java method: ${signature}`)
  const indent = lines[start].length - lines[start].trimStart().length
  const end = lines.findIndex((line, index) => index > start && line === ' '.repeat(indent) + '}')
  if (end < 0) throw new Error(`Missing closing brace: ${signature}`)
  return lines
    .slice(start, end + 1)
    .map(line => line.slice(indent))
    .join('\n')
}

for (const target of targets) {
  const source = await readFile(new URL(`src/tra-examples/${target.source}`, root), 'utf8')
  const destination = new URL(`src/data/${target.destination}`, root)
  let generated = `// Generated from ${target.source}. Edit the Java source, then run npm run sync:java-snippets.\n`
  for (const [name, signature] of Object.entries(target.methods)) {
    const snippet = extractMethod(source, signature).replaceAll('`', '\\`').replaceAll('${', '\\${')
    generated += `export const ${name} = \`${snippet}\`\n\n`
  }
  const filepath = fileURLToPath(destination)
  generated = await format(generated, { ...(await resolveConfig(filepath)), filepath })
  if (process.argv.includes('--check')) {
    if ((await readFile(destination, 'utf8')) !== generated) {
      throw new Error(
        `Java snippets are outdated: ${target.destination}. Run npm run sync:java-snippets.`,
      )
    }
  } else {
    await writeFile(destination, generated)
  }
}
console.log(
  process.argv.includes('--check')
    ? 'Java snippets match their TRA source.'
    : 'Updated TRA Java snippets.',
)

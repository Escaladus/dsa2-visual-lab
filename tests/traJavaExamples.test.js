import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, delimiter } from 'node:path'
import test from 'node:test'
import { hasPrimaryTraExamples } from '../src/data/traJavaExamples.js'
import { traReferenceExamples as traJavaExamples } from '../src/data/traReferenceExamples.js'
import { graphBasicsExample, graphConstructionExcerpt } from '../src/data/graphBasics.js'
import { javaExamples } from '../src/data/javaExamples.js'
import { topics } from '../src/data/topics.js'
import { readTraLibrary } from '../scripts/tra-library.mjs'

test('technical reference files and optional JDK comparison placement stay available', () => {
  assert.equal(javaExamples.length, 31, 'The original standalone catalogue stays intact')
  assert.deepEqual(
    readdirSync('src/tra-examples')
      .filter(name => name.endsWith('.java'))
      .sort(),
    traJavaExamples.map(example => `${example.className}.java`).sort(),
  )
  for (const example of traJavaExamples) {
    assert.ok(!javaExamples.some(original => original.className === example.className))
    assert.ok(example.output)
    for (const topic of example.topics)
      assert.ok(
        topics.some(item => item.id === topic),
        topic,
      )
    assert.match(
      readFileSync(`src/tra-examples/${example.className}.java`, 'utf8'),
      /import fi\.uef\.cs\.tra\./,
    )
  }
  for (const topic of ['graph-basics', 'maps']) {
    assert.ok(hasPrimaryTraExamples(topic))
    assert.ok(
      traJavaExamples.some(
        example => example.topics.includes(topic) && example.primaryTopics?.includes(topic),
      ),
    )
    assert.ok(
      javaExamples
        .find(example => example.id === 'graphRepresentation')
        .comparisonTopics.includes(topic),
    )
  }
  assert.equal(hasPrimaryTraExamples('graph-dfs'), true)
  for (const [topic, id] of [
    ['trees', 'treeTraversal'],
    ['heap', 'priorityQueue'],
    ['graph-apps', 'components'],
    ['graph-apps', 'topological'],
    ['graph-analysis', 'topological'],
    ['shortest-paths', 'dijkstra'],
    ['shortest-paths', 'floyd'],
    ['mst', 'mst'],
    ['graph-analysis', 'cuts'],
    ['graph-analysis', 'matching'],
    ['graph-analysis', 'flow'],
  ]) {
    assert.ok(hasPrimaryTraExamples(topic))
    assert.ok(javaExamples.find(example => example.id === id).comparisonTopics.includes(topic))
  }
  const snippet = graphConstructionExcerpt(
    readFileSync('src/tra-examples/TraGraphExample.java', 'utf8'),
  )
  assert.match(snippet, /public static DiGraph createDirectedGraph\(\)/)
  assert.match(snippet, /return graph;/)
})

const hasJdk = ['java', 'javac', 'jar'].every(name => spawnSync(name, ['--version']).status === 0)

test(
  'preserved technical TRA sources run on Java 11 and pass independent graph reference checks',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-examples-'))
    try {
      // These files remain technical references for existing visualisations, outside the student ZIP.
      const work = directory
      writeFileSync(join(work, 'traj.jar'), readTraLibrary())
      for (const example of traJavaExamples) {
        const name = `${example.className}.java`
        writeFileSync(join(work, name), readFileSync(resolve('src/tra-examples', name)))
      }
      const compile = spawnSync(
        'javac',
        [
          '--release',
          '11',
          '-Xlint:all',
          '-encoding',
          'UTF-8',
          '-classpath',
          join(work, 'traj.jar'),
          '-d',
          directory,
          ...traJavaExamples.map(example => join(work, `${example.className}.java`)),
          resolve('tests/fixtures/TraExamplesChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      for (const name of readdirSync(directory).filter(name => name.endsWith('.class')))
        assert.equal(readFileSync(join(directory, name)).readUInt16BE(6), 55, name)
      for (const example of traJavaExamples) {
        await t.test(
          `${example.className}: technical source and precompiled output match regression expectations`,
          () => {
            const source = spawnSync(
              'java',
              ['-Dfile.encoding=UTF-8', '-cp', 'traj.jar', `${example.className}.java`],
              { cwd: work, encoding: 'utf8', timeout: 15000 },
            )
            assert.equal(source.status, 0, source.stderr)
            assert.equal(source.stdout.trim().replace(/\r\n/g, '\n'), example.output)
            const compiled = spawnSync(
              'java',
              ['-cp', directory + delimiter + join(work, 'traj.jar'), example.className],
              { encoding: 'utf8', timeout: 10000 },
            )
            assert.equal(compiled.status, 0, compiled.stderr)
            assert.equal(compiled.stdout.trim().replace(/\r\n/g, '\n'), example.output)
          },
        )
      }
      await t.test(
        'directed and undirected graphs, every start/scope, duplicates, cycles, paths and repeat runs',
        () => {
          const result = spawnSync(
            'java',
            ['-cp', directory + delimiter + join(work, 'traj.jar'), 'TraExamplesChecks'],
            { encoding: 'utf8', timeout: 15000 },
          )
          assert.equal(result.status, 0, result.stdout + result.stderr)
          assert.match(result.stdout, /All TRA graph checks passed/)
          const graph = JSON.parse(
            result.stdout.split('\n').find(line => line.startsWith('{"vertices"')),
          )
          assert.deepEqual(
            graph.vertices.sort(),
            graphBasicsExample.vertices.map(vertex => vertex.label).sort(),
          )
          const sortedEdges = edges =>
            [...edges].sort((a, b) => `${a.from}:${a.to}`.localeCompare(`${b.from}:${b.to}`))
          assert.deepEqual(
            sortedEdges(graph.edges),
            sortedEdges(graphBasicsExample.edges),
            'The rendered drawing must describe the actual Java factory, including weights',
          )
        },
      )
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)

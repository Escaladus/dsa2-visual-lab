import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join } from 'node:path'
import test from 'node:test'
import { traLibraryPath } from '../scripts/tra-library.mjs'
import { traversalExamples } from '../src/data/graphTraversal.js'
import { dfsExamples } from '../src/data/recursiveDfs.js'
import { createGraphTraversalTrace } from '../src/utils/graphTraversal.js'
import { createRecursiveDfsTrace } from '../src/utils/recursiveDfs.js'
import { createBfsSteps, graphNodes } from '../src/utils/graphAlgorithms.js'

const hasJdk = ['java', 'javac'].every(name => spawnSync(name, ['--version']).status === 0)
const array = values => `[${values.join(', ')}]`
const literal = graph => `new int[][]{${graph.map(row => `{${row.join(',')}}`).join(',')}}`

// Observe the actual downloadable statements in a temporary copy. Production
// examples stay free of logging/test APIs. Missing selectors fail the test.
function observe(source, statement, callback) {
  assert.ok(source.includes(statement), `Missing TRA event statement: ${statement}`)
  return source.replaceAll(statement, `${statement}\n            ${callback}`)
}

test(
  'real TRA colour, queue and saved-caller events agree with the visualisations',
  { skip: hasJdk ? false : 'JDK 11+ required for actual execution events' },
  () => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-events-'))
    try {
      let extended = readFileSync('src/tra-examples/TraTraversalExample.java', 'utf8')
      for (const [statement, key, vertex, queue] of [
        ['v.setColor(GREY);', 'mark', 'v'],
        ['state.pre.add(v);', 'pre', 'v'],
        ['state.post.add(v);', 'post', 'v'],
        ['v.setColor(BLACK);', 'black', 'v'],
        ['start.setColor(GREY);', 'bfsMark', 'start'],
        ['next.setColor(GREY);', 'bfsMark', 'next'],
        ['state.discovered.add(start);', 'discover', 'start'],
        ['state.discovered.add(next);', 'discover', 'next'],
        ['queue.offer(start);', 'enqueue', 'start', 'queue'],
        ['queue.offer(next);', 'enqueue', 'next', 'queue'],
        ['Vertex v = queue.remove();', 'dequeue', 'v', 'queue'],
        ['state.completed.add(v);', 'processed', 'v'],
      ])
        extended = observe(
          extended,
          statement,
          `EventCheck.event("${key}", ${vertex}, state, ${queue ?? 'null'});`,
        )
      writeFileSync(join(directory, 'TraTraversalExample.java'), extended)
      let basic = readFileSync('src/tra-examples/TraRecursiveDfsExample.java', 'utf8')
      for (const [statement, key] of [
        ['visited.put(v, true);', 'mark'],
        ['pre.add(v);', 'pre'],
        ['post.add(v);', 'post'],
      ])
        basic = observe(basic, statement, `EventCheck.basic("${key}",v,-1,visited,pre,post);`)
      const call = 'dfs(next, visited, pre, post);'
      assert.ok(basic.includes(call))
      basic = basic.replace(
        call,
        `EventCheck.basic("wait",v,i,visited,pre,post); ${call} EventCheck.basic("resume",v,i,visited,pre,post);`,
      )
      writeFileSync(join(directory, 'TraRecursiveDfsExample.java'), basic)
      let bfs = readFileSync('src/tra-examples/TraBfsExample.java', 'utf8')
      for (const [statement, key, v] of [
        ['queue.offer(start);', 'enqueue', 'start'],
        ['queue.offer(next);', 'enqueue', 'next'],
        ['Vertex vertex = queue.remove();', 'dequeue', 'vertex'],
        ['vertex.setColor(AbstractGraph.BLACK);', 'processed', 'vertex'],
      ])
        bfs = observe(bfs, statement, `EventCheck.nativeBfs("${key}", ${v}, result, queue);`)
      writeFileSync(join(directory, 'TraBfsExample.java'), bfs)

      const expected = []
      const runs = []
      const extendedKeys = new Set([
        'mark',
        'pre',
        'post',
        'black',
        'bfsMark',
        'discover',
        'enqueue',
        'dequeue',
        'processed',
      ])
      for (const example of [
        ...Object.values(traversalExamples),
        { graph: [[0]], directed: true },
        { graph: [], directed: true },
      ]) {
        for (const algorithm of ['dfs', 'bfs'])
          for (const reverse of [false, true]) {
            const options = { start: 0, all: true, directed: example.directed, algorithm, reverse }
            runs.push(
              `extended(${literal(example.graph)}, ${example.directed}, ${algorithm === 'bfs'}, ${reverse});`,
            )
            for (const step of createGraphTraversalTrace(example.graph, options)) {
              const key = step.message.key
              if (!extendedKeys.has(key)) continue
              const v = step.message.values.v
              expected.push(
                [
                  'extended',
                  key,
                  v,
                  step.clock,
                  array(step.colors),
                  array(step.pre),
                  array(step.post),
                  array(step.removed),
                  array(step.parent),
                  array(step.root),
                  array(step.depth),
                  array(step.distance),
                  array(step.tin),
                  array(step.tout),
                  ['enqueue', 'dequeue'].includes(key) ? array(step.queue) : '-',
                ].join('|'),
              )
            }
          }
      }
      for (const example of Object.values(dfsExamples)) {
        runs.push(`basicRun(${literal(example.graph)});`)
        for (const step of createRecursiveDfsTrace(example.graph, 0, true)) {
          const key = step.message.key
          if (!['mark', 'pre', 'post', 'wait', 'resume'].includes(key)) continue
          expected.push(
            [
              'basic',
              key,
              step.message.values.v,
              ['wait', 'resume'].includes(key) ? step.nodes[step.current].locals.i : -1,
              array(step.visited),
              array(step.pre),
              array(step.post),
            ].join('|'),
          )
        }
      }
      const names = Object.keys(graphNodes)
      for (const [start, name] of names.entries()) {
        runs.push(`nativeRun(${start});`)
        for (const step of createBfsSteps(name)) {
          if (!['enqueue', 'dequeue', 'processed'].includes(step.kind)) continue
          expected.push(
            [
              'native',
              step.kind,
              start,
              names.indexOf(step.current),
              array(step.visited.map(v => names.indexOf(v))),
              array(step.order.map(v => names.indexOf(v))),
              array(names.map(v => step.distance[v] ?? -1)),
              array(names.map(v => (step.parent[v] == null ? -1 : names.indexOf(step.parent[v])))),
              array(names.map(v => step.colors[v])),
              array(step.frontier.map(v => names.indexOf(v))),
            ].join('|'),
          )
        }
      }
      writeFileSync(
        join(directory, 'EventCheck.java'),
        `
import fi.uef.cs.tra.*; import java.util.*;
public class EventCheck {
static List<Vertex> vertices; static int start; static List<Integer> removed;
static List<Integer> ids(List<Vertex> list){List<Integer> out=new ArrayList<>();for(Vertex v:list)out.add(vertices.indexOf(v));return out;}
static <T> List<T> values(Map<Vertex,T> map){List<T> out=new ArrayList<>();for(Vertex v:vertices)out.add(map.get(v));return out;}
static List<Integer> links(Map<Vertex,Vertex> map){List<Integer> out=new ArrayList<>();for(Vertex v:vertices)out.add(map.get(v)==null?-1:vertices.indexOf(map.get(v)));return out;}
static List<String> colors(){List<String> out=new ArrayList<>();for(Vertex v:vertices)out.add(v.getColor()==AbstractGraph.WHITE?"WHITE":v.getColor()==AbstractGraph.GREY?"GREY":"BLACK");return out;}
static AbstractGraph build(int[][] input,boolean directed){AbstractGraph graph=directed?new DiGraph():new Graph();vertices=new ArrayList<>();for(int i=0;i<input.length;i++)vertices.add(graph.addVertex("same"));for(int u=0;u<input.length;u++)for(int v:input[u])if(directed||u<v)vertices.get(u).addEdge(vertices.get(v));return graph;}
static void extended(int[][] input,boolean directed,boolean breadth,boolean reverse){AbstractGraph graph=build(input,directed);TraTraversalExample.traverse(graph,vertices,vertices.isEmpty()?null:vertices.get(0),true,breadth,reverse);}
static void event(String key,Vertex v,TraTraversalExample.State s,List<Vertex> queue){System.out.println("extended|"+key+"|"+s.id.get(v)+"|"+s.clock+"|"+colors()+"|"+ids(s.pre)+"|"+ids(s.post)+"|"+ids(s.removed)+"|"+links(s.parent)+"|"+links(s.root)+"|"+values(s.depth)+"|"+values(s.distance)+"|"+values(s.tin)+"|"+values(s.tout)+"|"+(queue==null?"-":ids(queue)));}
static void basicRun(int[][] input){AbstractGraph graph=build(input,false);TraRecursiveDfsExample.traverse(graph,vertices,vertices.get(0),true);}
static void basic(String key,Vertex v,int i,Map<Vertex,Boolean> visited,List<Vertex> pre,List<Vertex> post){System.out.println("basic|"+key+"|"+vertices.indexOf(v)+"|"+i+"|"+values(visited)+"|"+ids(pre)+"|"+ids(post));}
static void nativeRun(int from){Graph graph=TraBfsExample.createBasicGraph();vertices=new ArrayList<>();for(Vertex v:graph.vertices())vertices.add(v);start=from;removed=new ArrayList<>();TraBfsExample.search(graph,vertices.get(start));}
static void nativeBfs(String key,Vertex v,TraBfsExample.Result r,List<Vertex> queue){if(key.equals("dequeue"))removed.add(vertices.indexOf(v));List<Integer> distance=new ArrayList<>(),parent=new ArrayList<>();for(Vertex x:vertices){distance.add(r.distanceTo(x));parent.add(r.parentOf(x)==null?-1:vertices.indexOf(r.parentOf(x)));}System.out.println("native|"+key+"|"+start+"|"+vertices.indexOf(v)+"|"+ids(r.discovered())+"|"+removed+"|"+distance+"|"+parent+"|"+colors()+"|"+ids(queue));}
public static void main(String[] args){${runs.join('\n')}}
}`,
      )
      const compile = spawnSync(
        'javac',
        [
          '--release',
          '11',
          '-Xlint:all',
          '-cp',
          traLibraryPath,
          '-d',
          directory,
          ...['TraTraversalExample', 'TraRecursiveDfsExample', 'TraBfsExample', 'EventCheck'].map(
            name => join(directory, name + '.java'),
          ),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      const run = spawnSync('java', ['-cp', directory + delimiter + traLibraryPath, 'EventCheck'], {
        encoding: 'utf8',
        timeout: 15000,
        maxBuffer: 16 * 1024 * 1024,
      })
      assert.equal(run.status, 0, run.stderr)
      assert.deepEqual(run.stdout.trim().split(/\r?\n/), expected)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)

export const handout = { filename: 'dsaII_handout.pdf', title: 'Data Structures and Algorithms II', year: 2025 }

// PDF page numbers equal the printed page numbers in the supplied handout.
export const handoutSections = {
  overview: { section: '1–6', pages: '2–88' },
  recursion: { section: '1.3', pages: '12–18' },
  complexity: { section: '1.2–1.5', pages: '4–24' },
  'sorted-lists': { section: '1.6', pages: '25–26' },
  'sets-maps': { section: '1.6, 2.2', pages: '25–26, 30' },
  trees: { section: '1.6, 2.4', pages: '26, 38–41' },
  heap: { section: '1.6, 2.3, 3.1', pages: '26, 33–35, 48–50' },
  sorting: { section: '4.2, 5.3', pages: '60–61, 79–80' },
  'graph-basics': { section: '2.1–2.2, 6.1', pages: '27–31, 86–88' },
  'graph-dfs': { section: '2.4', pages: '37–40' },
  'graph-bfs': { section: '3.2', pages: '51–52' },
  'graph-apps': { section: '2.4, 3.2–3.4', pages: '37–45, 51–59' },
  'java-tools': { section: '1.6, 2.2, 6', pages: '25–26, 30–31, 85–86' },
  adts: { section: '1.6', pages: '25–26' },
  sets: { section: '1.6', pages: '25–26' },
  maps: { section: '1.6, 2.2', pages: '25–26, 30' },
  'shortest-paths': { section: '2.3', pages: '32–37' },
  mst: { section: '3.1', pages: '48–51' },
  'graph-analysis': { section: '2.4.1–2.4.3, 3.3–3.4', pages: '40–45, 53–59' },
  strategies: { section: '4.1–4.6', pages: '60–65' },
  'string-matching': { section: '4.7', pages: '65–72' },
  'external-memory': { section: '5', pages: '73–85' },
}

export const additionalTopics = [
  { id: 'adts', group: 1 }, { id: 'sets', group: 1 }, { id: 'maps', group: 1 },
  { id: 'shortest-paths', group: 4 }, { id: 'mst', group: 4 }, { id: 'graph-analysis', group: 4 },
  { id: 'strategies', group: 3 }, { id: 'string-matching', group: 3 }, { id: 'external-memory', group: 6 },
]

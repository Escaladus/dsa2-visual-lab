export function extendDictionary(base, supplement) {
  const pages = { ...base.pages }
  for (const [id, page] of Object.entries(supplement.pages)) {
    pages[id] = base.pages[id]
      ? { ...base.pages[id], ...page, cards: [...base.pages[id].cards, ...page.cards] }
      : page
  }
  return { ...base, ui: { ...base.ui, ...supplement.ui }, groups: [...base.groups, supplement.group], topics: [...base.topics, ...supplement.topics], pages, examples: supplement.examples }
}

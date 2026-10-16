type StatusRow = { status?: unknown };

export function summariseContentCounts(collections: StatusRow[][]) {
  return collections.flat().reduce((counts, row) => {
    if (row.status === 'draft') counts.drafts += 1;
    if (row.status === 'published') counts.published += 1;
    return counts;
  }, { drafts: 0, published: 0 });
}

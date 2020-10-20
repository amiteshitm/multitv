// build the software in category query.
export default function buildCatQuery ({ root_category: rootCategory }) {
  const rootCategoryMatch = {
    match: {
      root_category___id: { query: rootCategory.id },
    },
  }
  const matches = [rootCategoryMatch]

  categories.forEach(c => matches.push({ match: { categories___id: { query: c } } }))

  const functions = [{ filter: rootCategoryMatch, weight: 1.1 }]
  const selfFilter = { match: { slug: { query: software.slug } } }

  const query = {
    function_score: {
      query: {
        bool: {
          should: matches,
          must_not: selfFilter,
        },
      },
      functions,
    },
  }

  return query
}

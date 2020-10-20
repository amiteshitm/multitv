import isEmpty from 'lodash/isEmpty'

function buildCategoryMatch ({ rootCategory, categories }) {
  const rootCategoryMatch = {
    match: {
      root_category_id: { query: rootCategory._id },
    },
  }
  const matches = [rootCategoryMatch]

  categories.forEach(c => matches.push({ match: { categories___id: { query: c._id } } }))

  return matches
}

function buildFilteredQuery ({ rootCategory = null, categories = null, tag, pricing = null }) {
  let functionScoreMatches = {}
  let functionScoreFilters = []
  let functions = []

  if (!isEmpty(rootCategory) || !isEmpty(categories)) {
    const categoryMatch = buildCategoryMatch({ rootCategory, categories })
    const rootCategoryFilter = {
      match: {
        root_category_id: { query: rootCategory._id },
      },
    }
    functions.push({ filter: rootCategoryFilter, weight: 1.1 })

    functionScoreMatches = categoryMatch
  }

  if (!isEmpty(tag)) {
    const tagFilter = {
      match_phrase: {
        tags: { query: tag },
      },
    }

    functionScoreFilters.push(tagFilter)
  }

  if (!isEmpty(pricing)) {
    const pricingShould = [
      {
        match_phrase: {
          pricing: { query: pricing },
        },
      },
    ]

    if (pricing === 'free') {
      pricingShould.push({
        match_phrase: {
          pricing: { query: 'open' },
        },
      })
    }

    functionScoreFilters.push({
      bool: {
        should: pricingShould,
      },
    })
  }

  const query = {
    function_score: {
      query: {
        bool: {
          filter: functionScoreFilters,
        },
      },
      functions,
    },
  }

  if (!isEmpty(functionScoreMatches)) {
    query.function_score.query.bool.should = functionScoreMatches
    query.function_score.query.bool.minimum_should_match = '1'
  }

  return query
}

export { buildFilteredQuery }

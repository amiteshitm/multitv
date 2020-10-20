import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'

const traverse = (category, level = 0) => {
  if (!category.children) return
  if (category.children.length === 0) {
    return catToOption(category, level)
  } else {
    const catTree = category.children.map(c => {
      const catTree = traverse(c, level + 1)

      return <Fragment key={c.id}>{catTree}</Fragment>
    })

    return (
      <Fragment key={category.id}>
        {catToOption(category, level)}
        {catTree}
      </Fragment>
    )
  }
}

const catToOption = (cat, level = 0) => (
  <option key={cat._id} value={cat._id} dangerouslySetInnerHTML={{ __html: '&nbsp;'.repeat(level * 2) + cat.name }} />
)

const CategoryTree = ({ categories }) => {
  let tree = []

  categories
    .filter(c => c.parent_id === null)
    .forEach(c => {
      tree = tree.concat(catToOption(c))
      tree = tree.concat(c.children.map(cat => traverse(cat, 1)))
    })

  return tree
}

CategoryTree.fragments = {
  categories: gql`
    fragment CategoryTreeCategories on Category {
      _id
      name
      parent_id
      children {
        _id
        name
        children {
          _id
          name
          children {
            _id
            name
          }
        }
      }
    }
  `,
}

CategoryTree.propTypes = {
  categories: PropTypes.array.isRequired,
  input: PropTypes.object.isRequired,
  className: PropTypes.string,
  multiple: PropTypes.bool,
  includeBlank: PropTypes.bool,
}

export default CategoryTree

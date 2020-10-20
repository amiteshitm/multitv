import React from 'react'
import PropTypes from 'prop-types'

import Hero from 'components/shared/hero'

const CategoryHero = ({ category }) => <Hero name={category.name} header={category.desc} />

CategoryHero.propTypes = {
  category: PropTypes.object.isRequired,
}

export default CategoryHero

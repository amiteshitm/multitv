import React from 'react'
import PropTypes from 'prop-types'

import Hero from 'components/shared/hero'
import { capitalizeText } from 'shared/util'

const TagName = ({ tag }) => `${capitalizeText(tag)} Software, Tools & Apps`
const TagHeader = ({ tag }) => `All the software, tools & apps tagged as ${capitalizeText(tag)}`

const TaggedHero = ({ tag }) => <Hero name={TagName({ tag })} header={TagHeader({ tag })} />

TaggedHero.propTypes = {
  tag: PropTypes.string.isRequired,
}

export default TaggedHero

import React from 'react'
import PropTypes from 'prop-types'

import Breadcrumbs from 'components/shared/breadcrumbs'

const TaggedBreadcrumbBar = ({ tag }) => {
  const path = [{ name: 'Home', href: '/', as: '/' }]
  const taggedPath = `/tagged/${encodeURIComponent(tag)}`

  path.push({ name: tag, href: taggedPath, as: taggedPath })

  return <Breadcrumbs path={path} />
}

TaggedBreadcrumbBar.propTypes = {
  tag: PropTypes.string.isRequired,
}

export default TaggedBreadcrumbBar

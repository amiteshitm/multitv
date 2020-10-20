import React from 'react'
import PropTypes from 'prop-types'

import CategoryTree from 'shared/category-tree'

export const CategorySelect = ({ input, label, className, meta: { touched, error }, ...props }) => (
  <div>
    <label>{label}</label>
    <CategoryTree input={input} {...props} className={className} />
    {touched && error && <div className={custom['errors']}>{error}</div>}
  </div>
)

CategorySelect.propTypes = {
  input: PropTypes.object,
  className: PropTypes.string,
  meta: PropTypes.object,
  label: PropTypes.string,
}

export default CategorySelect

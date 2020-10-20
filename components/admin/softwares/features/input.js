import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from '@material-ui/core/Checkbox'

export default function FeatureInput ({ feature, onInputChange }) {
  const handleCBChange = id => event => {
    if (event.target.checked === false) {
      onInputChange(feature)
    }
  }

  const components = {
    Boolean: Checkbox,
  }
  const Component = components[feature.data_type]

  return (
    <>
      <Component value={feature.feature_id} checked={true} onChange={handleCBChange(f.feature_id)} />
    </>
  )
}

FeatureInput.propTypes = {
  feature: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired,
}

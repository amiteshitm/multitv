import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from '@material-ui/core/Checkbox'

const MaterialCheckbox = ({ input: { onChange }, meta: { touched, error }, label, fieldIndex, ...custom }) => (
  <Checkbox
    label={label}
    onChange={(_event, checked) => onChange(checked)}
    variant="outlined"
    error={!!touched && !!error}
    {...custom}
  />
)

MaterialCheckbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  fieldIndex: PropTypes.string,
  meta: PropTypes.object,
  custom: PropTypes.object,
}

export default MaterialCheckbox

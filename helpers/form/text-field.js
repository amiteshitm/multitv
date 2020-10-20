import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import TextField from '@material-ui/core/TextField'

const StyledTextField = styled(TextField)`
  ${props => props.textTransform && css`
    text-transform: ${props.textTransform};
  `}
`

const MaterialTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <StyledTextField
    label={label}
    variant='outlined'
    error={!!touched && !!error}
    helperText={!!touched && error}
    {...input}
    {...custom}
  />
)

MaterialTextField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  custom: PropTypes.object,
}

export default MaterialTextField

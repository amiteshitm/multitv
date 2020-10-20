import React from 'react'
import PropTypes from 'prop-types'

import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}))

const MaterialSelectField = ({
  input,
  children,
  onChange,
  meta: { touched, error },
  controlProps,
  includeBlank = false,
  ...custom
}) => {
  const { label, labelWidth } = custom
  const { name } = input
  const classes = useStyles()

  return (
    <FormControl {...controlProps} className={classes.formControl}>
      <InputLabel htmlFor={`select-${name}`}>{label}</InputLabel>
      <Select
        native
        {...input}
        variant="outlined"
        {...custom}
        input={<Input labelWidth={labelWidth} name={name} id={`select-${name}`} />}
      >
        {includeBlank && <option value="" />}
        {children}
      </Select>
      {touched && error && <FormHelperText error={!!error}>{error}</FormHelperText>}
    </FormControl>
  )
}

MaterialSelectField.defaultProps = {
  controlProps: {
    variant: 'outlined',
    fullWidth: false,
  },
}

MaterialSelectField.propTypes = {
  input: PropTypes.object,
  children: PropTypes.node,
  onChange: PropTypes.func,
  label: PropTypes.string,
  meta: PropTypes.object,
  controlProps: PropTypes.object,
  includeBlank: PropTypes.bool,
  custom: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
}

export default MaterialSelectField

import React from 'react'

import custom from '../styles/custom.css'

const Errors = (props) => {
  const error = props.errors[Object.keys(props.errors)[0]]

  return (
    <span style={custom.errors}>
      {error && error.message}
    </span>
  )
}

export default Errors

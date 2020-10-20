import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'

export default function WrappedButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>
}

WrappedButton.propTypes = {
  children: PropTypes.node.isRequired
}

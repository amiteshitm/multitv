import React from 'react'
import PropTypes from 'prop-types'

function withLoadingIndicator (Component) {
  const withProps = props => {
    if (props.data.loading) return 'Loading ...'

    return <Component {...props} />
  }

  withProps.propTypes = {
    data: PropTypes.object,
  }

  return withProps
}

export default withLoadingIndicator

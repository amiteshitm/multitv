import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

export default function BrokerDetail({ details }) {
  return <ReactMarkdown source={details} />
}

BrokerDetail.propTypes = {
  details: PropTypes.string.isRequired
}

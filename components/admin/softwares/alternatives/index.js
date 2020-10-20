import React from 'react'
import { compose } from 'react-apollo'
import PropTypes from 'prop-types'

import { reduxForm } from 'redux-form'

function Alternatives ({ software, ...props }) {}

export default compose(
  reduxForm({
    form: 'AlternativesForm',
  })
)(Alternatives)

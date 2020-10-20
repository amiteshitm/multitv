import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import SoftwareTile from 'components/software/tile'
import globalStyles from 'shared/styles'

const useStyles = makeStyles(theme => ({
  layout: globalStyles(theme).layout,
}))

export default function AlternativesList ({ alternativesES }) {
  const classes = useStyles()
  const alternatives = alternativesES.edges.map((alternative, idx) => {
    return (
      <div className={classes.layout} key={idx}>
        <SoftwareTile software={alternative.node._source} />
      </div>
    )
  })

  return <>{alternatives}</>
}

AlternativesList.propTypes = {
  alternativesES: PropTypes.object.isRequired,
}

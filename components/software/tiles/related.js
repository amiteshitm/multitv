import React from 'react'
import PropTypes from 'prop-types'

import Link from 'next/link'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  contentRoot: {
    padding: `0 ${theme.spacing(2)}px`,
  },
}))

export default function Related ({ relatedES, software }) {
  const classes = useStyles()

  const related = relatedES.edges.map((related, idx) => {
    const s = related.node._source
    return (
      <Typography key={idx} color="textSecondary" gutterBottom>
        <Link href={{ pathname: '/software', query: { slug: s.slug } }} as={`/${s.slug}`}>
          <a>{s.name}</a>
        </Link>
      </Typography>
    )
  })

  return (
    <Card>
      <CardHeader title={`${software.name} Alternatives`} />
      <CardContent className={classes.contentRoot}>{related}</CardContent>
      <CardActions disableSpacing>
        <Link
          href={{ pathname: '/alternatives', query: { slug: software.slug } }}
          as={`/alternatives/${software.slug}`}
        >
          <Button size="small">{software.name} Alternatives</Button>
        </Link>
      </CardActions>
    </Card>
  )
}

Related.propTypes = {
  software: PropTypes.object.isRequired,
  relatedES: PropTypes.object.isRequired,
}

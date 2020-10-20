import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import classNames from 'classnames'

import { withStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import { NextLink } from 'shared/util'

import globalStyles from 'shared/styles'

const styles = theme => ({
  cardGrid: {
    padding: `${theme.spacing(8)}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  layout: globalStyles(theme).layout,
  actionArea: {
    '&:hover': {
      opacity: 0,
    },
  },
})

const SoftwareList = ({ classes, softwares }) => (
  <div className={classNames(classes.layout, classes.cardGrid)}>
    <Grid container spacing={3}>
      {softwares.map(s => (
        <Grid item key={s.slug} sm={6} md={4} lg={3}>
          <Card className={classes.card}>
            <CardMedia className={classes.cardMedia} image={s.upload && s.upload.filepath} title={s.name} />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant="h6" component="h3">
                <NextLink href={{ pathname: '/software', query: { slug: s.slug } }} as={`/${s.slug}`}>
                  <a>{s.name}</a>
                </NextLink>
              </Typography>
              <Typography>{s.desc}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <style jsx>
      {`
        a {
          text-decoration: none;
          color: black;
        }
      `}
    </style>
  </div>
)

SoftwareList.fragments = {
  softwares: gql`
    fragment SoftwareListSoftwares on Software {
      name
      desc
      slug
      upload(aspect: "medium") {
        name
        alt
        filepath
      }
    }
  `,
}

SoftwareList.propTypes = {
  classes: PropTypes.object,
  softwares: PropTypes.array.isRequired,
}

export default withStyles(styles)(SoftwareList)

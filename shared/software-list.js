import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import classNames from 'classnames'
import Link from 'next/link'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'

import globalStyles from 'shared/styles'

const useStyles = makeStyles(theme => ({
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
}))

const NextLink = ({ href, children, as }) => (
  <Link href={href} as={as}>
    {children}
  </Link>
)

const SoftwareList = ({ softwares }) => {
  const classes = useStyles()

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={40}>
        {softwares.edges.map(edge => {
          const s = edge.node._source
          const upload = s.uploads && s.uploads.find(u => u && u.aspect === 'medium')

          return (
            <Grid item key={s.slug} sm={6} md={4} lg={3}>
              <Card className={classes.card}>
                <CardMedia className={classes.cardMedia} image={upload && upload.filepath} title={s.name} />
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
          )
        })}
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
}

SoftwareList.fragments = {
  softwares: gql`
    fragment SoftwareListCategory on Category {
      softwares {
        name
        desc
        slug
        tags
        upload(aspect: "medium") {
          name
          alt
          filepath
        }
      }
    }
  `,
}

SoftwareList.propTypes = {
  softwares: PropTypes.object.isRequired,
}

export default SoftwareList

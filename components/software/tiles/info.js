import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import LanguageIcon from '@material-ui/icons/Language'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import AndroidIcon from '@material-ui/icons/Android'
import IphoneIcon from '@material-ui/icons/PhoneIphone'
import Box from '@material-ui/core/Box'
import Icon from '@material-ui/core/Icon'

import useFontAwesome from 'shared/hooks/font-awesome'

const useStyles = makeStyles(theme => ({
  contentRoot: {
    padding: `0 ${theme.spacing(2)}px`,
  },
  icon: {
    marginRight: theme.spacing(1),
    fontSize: 32,
  },
  twitter: {
    color: '#00aced',
  },
  windows: {
    color: '#00adef',
  },
}))

const InfoLink = ({ href, title, icon }) => {
  useFontAwesome()

  return (
    <Box display="flex" justifyContent="left" alignItems="center" mb={1}>
      {icon}
      <a href={href} rel="nofollow noopener noreferrer" target="_blank">
        {title}
      </a>
      <a href={href} rel="noopener noreferrer" target="_blank" style={{ marginLeft: 'auto' }}>
        <OpenInNewIcon />
      </a>
    </Box>
  )
}

function Info ({ software }) {
  const classes = useStyles()
  const { name, website, twitter, apps } = software

  return (
    <Box mb={2}>
      <Card>
        <CardHeader title={`About ${name}`} />
        <CardContent className={classes.contentRoot}>
          {website && (
            <InfoLink
              href={website}
              title={`${software.name} Website`}
              icon={<LanguageIcon color="primary" className={classes.icon} />}
            />
          )}
          {twitter && (
            <InfoLink
              href={`https://twitter.com/${twitter}`}
              title={`${name} Twitter`}
              icon={<Icon className={classnames(classes.twitter, classes.icon, 'fab fa-twitter')} />}
            />
          )}
          {apps && apps.android && (
            <InfoLink
              href={apps.android}
              title={`${name} Android App`}
              icon={<AndroidIcon color="primary" className={classes.icon} />}
            />
          )}
          {apps && apps.ios && (
            <InfoLink
              href={apps.ios}
              title={`${name} iOS App`}
              icon={<IphoneIcon color="primary" className={classes.icon} />}
            />
          )}
          {apps && apps.windows && (
            <InfoLink
              href={apps.windows}
              title={`${name} Windows application`}
              icon={<Icon className={classnames(classes.windows, classes.icon, 'fab fa-windows')} />}
            />
          )}
          {apps && apps.mac && (
            <InfoLink
              href={apps.mac}
              title={`${name} Mac Application`}
              icon={<Icon className={classnames(classes.icon, 'fab fa-apple')} />}
            />
          )}
          {apps && apps.linux && (
            <InfoLink
              href={apps.linux}
              title={`${name} Linux Application`}
              icon={<Icon className={classnames(classes.icon, 'fab fa-linux')} />}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

Info.propTypes = {
  software: PropTypes.object.isRequired,
}

export default Info

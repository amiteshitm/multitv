import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'
import Link from 'next/link'
import classNames from 'classnames'

import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import Divider from '@material-ui/core/Divider'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// import withAuth from 'helpers/with-auth'

const NextLink = itemProps => (
  <Link href={itemProps.href}>
    <ListItem button component="a">
      {itemProps.children}
    </ListItem>
  </Link>
)

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}))

function AdminDashboard (props) {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const [sidebarOpen, setSidebarOpen] = useState(matches)
  const toggleSideBar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    setSidebarOpen(matches)
  }, [matches])

  let sidebarContent = (
    <List>
      <NextLink href="/admin/softwares">
        <ListItemText primary="Softwares" />
      </NextLink>
      <NextLink href="/admin/categories">
        <ListItemText primary="Categories" />
      </NextLink>
      <NextLink href="/admin/features">
        <ListItemText primary="Features" />
      </NextLink>
    </List>
  )

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: sidebarOpen,
        })}
      >
        <Toolbar disableGutters={!sidebarOpen} className={classNames(classes.menuButton)}>
          <IconButton color="inherit" aria-label="Open drawer" onClick={toggleSideBar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h3" color="inherit" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="persistent"
        open={sidebarOpen}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h4">
            <Link href="/admin/dashboard">
              <a>Fintrakk</a>
            </Link>
          </Typography>
        </div>
        <Divider />
        {sidebarContent}
      </Drawer>
      <div
        className={classNames(classes.content, {
          [classes.contentShift]: sidebarOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        {props.children}
      </div>
    </div>
  )
}

AdminDashboard.propTypes = {
  children: PropTypes.node.isRequired,
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    // Use current URL later to redirect back.
    // currentURL: ownProps.location.pathname,
  }
}

// Use connect to put them together
export default compose(
  // withTheme,
  // withStyles(styles),
  connect(mapStateToProps)
)(AdminDashboard)

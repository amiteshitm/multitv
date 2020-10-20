import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'

import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/styles'
import { removeFlashMessage } from 'redux-flash-messages'

const styles = theme => ({
  close: {
    padding: theme.spacing(0.5),
  },
})

class FlashMessage extends Component {
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ open: false })
  }

  onFlashMessageClick = flashMessage => ev => {
    /*
      Make sure the onClick is called when a user clicks
      on the flash message.

      Otherwise callbacks on Flash Messages will not work.
    */
    flashMessage.onClick(flashMessage)

    // This implementation deletes the flash message when it is clicked.
    this.props.dispatch(removeFlashMessage(flashMessage.id))
  }

  render () {
    const { messages } = this.props
    return (
      <Fragment>
        {messages.map(message => (
          <Snackbar
            key={message.id}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={true}
            autoHideDuration={6000}
            onClose={this.onFlashMessageClick}
            onExited={this.onFlashMessageClick}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{message.text}</span>}
            action={[
              <Button key="undo" color="secondary" size="small" onClick={this.onFlashMessageClick}>
                CLOSE
              </Button>,
              <IconButton key="close" aria-label="Close" color="inherit" onClick={this.onFlashMessageClick(message)}>
                <CloseIcon />
              </IconButton>,
            ]}
          />
        ))}
      </Fragment>
    )
  }
}

// Retrieve data from store as props
function mapStateToProps (state, props) {
  return {
    messages: state.flashMessage.messages,
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(FlashMessage)

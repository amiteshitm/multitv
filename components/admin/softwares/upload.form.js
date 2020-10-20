import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import { compose } from 'react-apollo'
import { gql } from 'apollo-boost'

import CircularProgress from '@material-ui/core/CircularProgress'

import { uploadFileMutation } from 'mutations/upload/create'
import { softwareUpdateMutation } from 'mutations/software/edit'

const Image = ({ source }) => <img src={`${source.filepath}`} alt={`${source.name}`} />

Image.propTypes = {
  source: PropTypes.object.isRequired,
}

class UploadForm extends Component {
  state = { loading: false }

  updateLogo = ({ file, slug }) => {
    this.setState({ loading: 'logo' })
    this.props
      .softwareUpdate({ slug, logo: file })
      .then(res => {
        this.setState({ loading: false })
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
  }

  updateFile = ({ file, slug }) => {
    this.setState({ loading: 'file' })
    this.props
      .softwareUpdate({ slug, uploads: [{ file }] })
      .then(res => {
        this.setState({ loading: false })
        window.location.reload()
      })
      .catch(err => {
        this.setState({ loading: false })
        console.log(err)
      })
  }

  handleChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    const { software } = this.props

    return validity.valid && this.updateFile({ slug: software.slug, file })
    // return validity.valid && this.props.uploadFile(file)
  }

  handleLogoChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    const { software } = this.props

    return validity.valid && this.updateLogo({ file, slug: software.slug })
    // return validity.valid && this.props.uploadFile(file)
  }

  render () {
    const {
      software: { upload, logo },
    } = this.props

    return (
      <Fragment>
        <div>
          {upload ? (
            <Image source={upload} />
          ) : this.state.loading === 'file' ? (
            <CircularProgress color="primary" />
          ) : (
            <div>
              <strong>File</strong>
              <br />
              <input type="file" accept="image/*" required onChange={this.handleChange} />
            </div>
          )}
        </div>
        <div>
          {logo ? (
            <Image source={logo} />
          ) : this.state.loading === 'logo' ? (
            <CircularProgress color="primary" />
          ) : (
            <div>
              <strong>Logo</strong>
              <br />
              <input type="file" accept="image/*" required onChange={this.handleLogoChange} />
            </div>
          )}
        </div>
      </Fragment>
    )
  }
}

UploadForm.fragments = {
  upload: gql`
    fragment SoftwareUploads on Software {
      upload(aspect: "proof") {
        id
        name
        filepath
        alt
      }
    }
  `,
  logo: gql`
    fragment SoftwareLogo on Software {
      logo(aspect: "small") {
        id
        name
        filepath
        alt
      }
    }
  `,
}

UploadForm.propTypes = {
  software: PropTypes.object,
  softwareUpdate: PropTypes.func,
}

export default compose(
  softwareUpdateMutation(),
  uploadFileMutation()
)(UploadForm)

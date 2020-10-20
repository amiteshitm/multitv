import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pick } from 'lodash'

import { reduxForm, Field } from 'redux-form'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withRouter } from 'next/router'
import getConfig from 'next/config'

import validator from 'validator'
import { addSuccess, addError } from 'redux-flash-messages'

import { Box } from '@material-ui/core'

import FlexContainer from 'components/shared/flex-container'
import StyledButton from 'components/shared/button'
import TextField from 'helpers/form/text-field'
import SelectField from 'helpers/form/select-field'
import ChipInputField from 'helpers/form/chip-field'
import DraftEditor from 'helpers/draft-editor'
import { softwareCreateMutation } from 'mutations/software/create'
import { softwareUpdateMutation } from 'mutations/software/edit'
import CategoryTree from 'shared/category-tree'
import FlashMessages from 'helpers/flash-messages'

import { withTheme } from '@material-ui/styles'

const { publicRuntimeConfig } = getConfig()

class SoftwareDescriptionForm extends Component {
  constructor (props) {
    super(props)
    if (props.software) {
      props.initialize(props.software)
    }
  }

  onSubmit = (values, _dispatch, { registeredFields }) => {
    const { softwareCreate, router, isEditing, softwareUpdate } = this.props

    if (isEditing) {
      const submitValues = pick(values, Object.keys(registeredFields))

      return softwareUpdate(submitValues)
        .then(result => {
          addSuccess({ text: 'Software was updated successfully' })
          router.push('/admin/softwares')
        })
        .catch(error => addError({ text: `Unable to save software: ${error}` }))
    } else {
      return softwareCreate(values)
        .then(result => {
          addSuccess({ text: 'Software was created successfully' })
          router.push('/admin/softwares')
        })
        .catch(error => addError({ text: `Unable to save software: ${error}` }))
    }
  }

  render () {
    const {
      handleSubmit,
      isSubmitting,
      isEditing,
      data: { loading, categoryMany: categories },
      theme,
    } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    const catTree = CategoryTree({ categories })

    return (
      <FlexContainer direction="column">
        <FlashMessages />
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <FlexContainer flexBasis="33%" marginBottom={`${theme.spacing(2)}px`}>
            <Field
              name={'name'}
              label="Software Name"
              placeholder="Software Name"
              disabled={isSubmitting || isEditing}
              component={TextField}
            />
          </FlexContainer>

          <FlexContainer marginBottom={`${theme.spacing(2)}px`} flexBasis="50%">
            <Field
              name={'desc'}
              label="Short Description"
              placeholder="Short Description"
              multiline={true}
              rows="2"
              fullWidth={true}
              disabled={isSubmitting}
              component={TextField}
            />
          </FlexContainer>

          <FlexContainer justifyContent="space-between" marginBottom={`${theme.spacing(2)}px`}>
            <Field
              name={'slug'}
              label="Slug"
              placeholder="Slug"
              style={{ textTransform: 'lowercase' }}
              disabled={isSubmitting || isEditing}
              component={TextField}
            />
            <Field
              name={'categories'}
              label="Category"
              categories={categories}
              multiple={true}
              disabled={isSubmitting}
              component={SelectField}
            >
              {catTree}
            </Field>
          </FlexContainer>

          <FlexContainer flexBasis="50%" marginBottom={`${theme.spacing(2)}px`}>
            <Field
              name={'root_category_id'}
              label="Main Category"
              categories={categories}
              multiple={false}
              disabled={isSubmitting}
              component={SelectField}
            >
              {catTree}
            </Field>
          </FlexContainer>

          <FlexContainer marginBottom={`${theme.spacing(2)}px`} justifyContent="space-between">
            <Field
              name={'github'}
              label="Github"
              placeholder="Github (only handle not URL)"
              disabled={isSubmitting}
              component={TextField}
            />

            <Field
              name={'medium'}
              label="Medium"
              placeholder="Medium (only handle not URL)"
              disabled={isSubmitting}
              component={TextField}
            />
          </FlexContainer>

          <FlexContainer marginBottom={`${theme.spacing(2)}}px`} justifyContent="space-between">
            <Field name={'tags'} label="Software Tags" component={ChipInputField} />
            <Field name={'pricing'} label="Pricing" component={SelectField} includeBlank={true}>
              {publicRuntimeConfig.pricing.reduce(
                (acc, pricing, idx) => [
                  ...acc,
                  <option key={idx} value={pricing.value}>
                    {pricing.label}
                  </option>,
                ],
                []
              )}
            </Field>
          </FlexContainer>

          <FlexContainer marginBottom={`${theme.spacing(2)}px`}>
            <Field name={'details'} label="Software Details" component={DraftEditor} />
          </FlexContainer>

          <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3} flexDirection="row" flexBasis="33%">
            <Field
              name={'website'}
              label="Website"
              placeholder="Website"
              disabled={isSubmitting}
              component={TextField}
            />

            <Field
              name={'twitter'}
              label="Twitter Handle"
              placeholder="Twitter (only handle not URL)"
              disabled={isSubmitting}
              component={TextField}
            />

            <Field
              name={'reddit'}
              label="Reddit Handle"
              placeholder="Reddit (only handle not URL)"
              disabled={isSubmitting}
              component={TextField}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3} flexDirection="row" flexBasis="33%">
            <Field
              name={'apps.ios'}
              label="IOS App URL"
              placeholder="URL to iTunes Store"
              disabled={isSubmitting}
              component={TextField}
            />

            <Field
              name={'apps.android'}
              label="Android App URL"
              placeholder="URL to Google Play Store"
              disabled={isSubmitting}
              component={TextField}
            />

            <Field
              name={'apps.mac'}
              label="App Mac OS URL"
              placeholder="URL to App's MacOS App"
              disabled={isSubmitting}
              component={TextField}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" flexWrap="wrap" mb={3} flexDirection="row" flexBasis="33%">
            <Field
              name={'apps.mac'}
              label="App windows URL"
              placeholder="URL to App's Windows App"
              disabled={isSubmitting}
              component={TextField}
            />

            <Field
              name={'apps.linux'}
              label="App linux URL"
              placeholder="URL to App's Linux app"
              disabled={isSubmitting}
              component={TextField}
            />
          </Box>

          <FlexContainer>
            <StyledButton type="submit" variant="contained" color="primary" size="large" className="button">
              {this.props.isEditing ? 'Update' : 'Submit'}
            </StyledButton>
          </FlexContainer>
        </form>
      </FlexContainer>
    )
  }
}

SoftwareDescriptionForm.propTypes = {
  isEditing: PropTypes.bool,
  softwareCreate: PropTypes.func,
  softwareUpdate: PropTypes.func,
  data: PropTypes.object,
  isSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  software: PropTypes.object,
  initialize: PropTypes.func,
  theme: PropTypes.object,
  router: PropTypes.object,
}

const ConnectSoftwareDescriptionForm = reduxForm({
  form: 'SoftwareDescriptionForm',
  validate: values => {
    const errors = {}

    if (!values.name) {
      errors.name = 'Name is a required field'
    }

    if (!values.slug) {
      errors.slug = 'Slug is a required field'
    }
    if (!/^[-a-z0-9]+$/.test(values.slug)) {
      errors.slug = 'Only Alphanumeric or Hyphen'
    }

    /* if (!values.twitter) {
      errors.twitter = 'Twitter is a required field'
    } */
    if (!/^[-_.a-zA-Z0-9]+$/.test(values.twitter)) {
      errors.twitter = 'Only Alphanumeric/Hyphen/Underscore/dot'
    }

    if (!/^[-_.a-zA-Z0-9]+$/.test(values.reddit)) {
      errors.reddit = 'Only Alphanumeric/Hyphen/Underscore/dot'
    }

    if (values.github && !/^[-_.a-zA-Z0-9]+$/.test(values.github)) {
      errors.github = 'Only Alphanumeric/Hyphen/Underscore/dot'
    }
    if (values.medium && !/^[-_.a-zA-Z0-9]+$/.test(values.medium)) {
      errors.medium = 'Only Alphanumeric/Hyphen/Underscore/dot'
    }
    if (!values.website) {
      errors.website = 'Website is a required field'
    }
    if (
      values.website &&
      !validator.isURL(values.website, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
      })
    ) {
      errors.website = 'Not a valid Url'
    }

    if (!values.desc) {
      errors.desc = 'Required field'
    }
    if (!values.pricing) {
      errors.pricing = 'Required field'
    }

    if (!values.categories || values.categories.length === 0) {
      errors.categories = 'Required field'
    }

    if (values.desc && (values.desc.length < 50 || values.desc.length > 300)) {
      errors.desc = 'Min 50 chars and max 300 chars'
    }
    if (values.videos) {
      const videosArrayErrors = []
      values.videos.forEach((video, videoIndex) => {
        const videoErrors = {}
        if (!video || !video.title) {
          videoErrors.title = 'Ttile of the video Required'
          videosArrayErrors[videoIndex] = videoErrors
        }
        if (!video || !video.embed_code) {
          videoErrors.embed_code = 'Source of the video Required'
          videosArrayErrors[videoIndex] = videoErrors
        }
      })
      errors.videos = videosArrayErrors
    }
    return errors
  },
})(SoftwareDescriptionForm)

export default compose(
  withTheme,
  softwareCreateMutation(),
  softwareUpdateMutation(),
  graphql(
    gql`
      query GetCategories {
        categoryMany {
          ...CategoryTreeCategories
        }
      }
      ${CategoryTree.fragments.categories}
    `
  ),
  withRouter
)(ConnectSoftwareDescriptionForm)

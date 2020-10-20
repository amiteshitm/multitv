import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'next/router'
import gql from 'graphql-tag'

import _ from 'lodash'
import { addSuccess } from 'redux-flash-messages'

import { withTheme } from '@material-ui/styles'

import FlexContainer from 'components/shared/flex-container'
import StyledButton from 'components/shared/button'
import TextField from 'helpers/form/text-field'
import SelectField from 'helpers/form/select-field'

import DraftEditor from 'helpers/draft-editor'
import { categoryCreateMutation } from 'mutations/category/create'
import { categoryUpdateMutation } from 'mutations/category/edit'
import CategoryTree from 'shared/category-tree'

class CategoryDescriptionForm extends Component {
  constructor (props) {
    super(props)
    if (props.category) {
      props.initialize(_.omit(props.category, '__typename'))
    }
  }

  onSubmit = (values, _dispatch, { registeredFields }) => {
    const { categoryCreate, categoryUpdate, router, isEditing } = this.props

    if (isEditing) {
      const registeredKeys = Object.keys(registeredFields)
      const submitValues = Object.keys(values)
        .filter(key => registeredKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = values[key]
          return obj
        }, {})

      return categoryUpdate(submitValues)
        .then(result => {
          addSuccess({ text: 'Category was updated successfully' })
          router.push('/admin/categories')
        })
        .catch(error => console.log(error))
    } else {
      return categoryCreate(values)
        .then(result => {
          addSuccess({ text: 'Category was created successfully' })
          router.push('/admin/categories')
        })
        .catch(error => console.log(error))
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
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <FlexContainer flexBasis="25%" marginBottom={`${theme.spacing(2)}px`}>
          <Field
            name={'name'}
            label="Category Name"
            placeholder="Category Name"
            disabled={isSubmitting || isEditing}
            component={TextField}
          />
        </FlexContainer>

        <FlexContainer marginBottom={`${theme.spacing.unit * 2}px`} width="50%">
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

        <FlexContainer width="50%" justifyContent="space-between" marginBottom={`${theme.spacing.unit * 2}px`}>
          <Field
            name={'slug'}
            label="Slug"
            placeholder="Slug"
            style={{
              textTransform: 'lowercase',
            }}
            disabled={isSubmitting || isEditing}
            component={TextField}
          />
          <Field
            name={'parent_id'}
            label="Parent"
            categories={categories}
            multiple={false}
            labelWidth={120}
            includeBlank={true}
            disabled={isSubmitting || isEditing}
            component={SelectField}
          >
            {catTree}
          </Field>
        </FlexContainer>

        <FlexContainer marginBottom={`${theme.spacing.unit * 2}px`}>
          <Field name={'details'} label="Category Details" component={DraftEditor} />
        </FlexContainer>

        <FlexContainer>
          <StyledButton type="submit" variant="contained" color="primary" size="large" className="button">
            {this.props.isEditing ? 'Update' : 'Submit'}
          </StyledButton>
        </FlexContainer>
      </form>
    )
  }
}

CategoryDescriptionForm.propTypes = {
  isEditing: PropTypes.bool,
  categoryCreate: PropTypes.func,
  categoryUpdate: PropTypes.func,
  data: PropTypes.object,
  isSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  category: PropTypes.object,
  initialize: PropTypes.func,
  router: PropTypes.object,
  theme: PropTypes.object,
}

const ConnectCategoryDescriptionForm = reduxForm({
  form: 'CategoryDescriptionForm',
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

    if (!values.desc) {
      errors.desc = 'Required field'
    }

    if (values.desc && (values.desc.length < 50 || values.desc.length > 300)) {
      errors.desc = 'Min 50 chars and max 300 chars'
    }

    return errors
  },
})(CategoryDescriptionForm)

const WithTheme = withTheme(ConnectCategoryDescriptionForm)

export default compose(
  categoryCreateMutation(),
  categoryUpdateMutation(),
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
)(WithTheme)

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
import { featureCreateMutation } from 'mutations/feature/create'
import withApollo from 'util/apollo'

class FeatureDescriptionForm extends Component {
  dataTypes = [
    {
      key: 'Boolean',
      value: 'Boolean'
    },
    { key: 'String', value: 'String' }
  ]

  constructor(props) {
    super(props)
    if (props.feature) {
      props.initialize(_.omit(props.feature, '__typename'))
    }
  }

  onSubmit = values => {
    const { featureCreate, router } = this.props

    return featureCreate(values)
      .then(result => {
        addSuccess({ text: 'Feature was created successfully' })
        router.push('/admin/features')
      })
      .catch(error => console.log(error))
  }

  render() {
    const {
      handleSubmit,
      isSubmitting,
      isEditing,
      data: { loading, features },
      theme
    } = this.props

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <FlexContainer direction="column">
          <FlexContainer
            marginTop={`${theme.spacing.unit * 2}px`}
            marginBottom={`${theme.spacing.unit * 2}px`}
          >
            <Field
              name="name"
              label="Feature Name"
              placeholder="Feature Name"
              disabled={isSubmitting || isEditing}
              component={TextField}
            />
          </FlexContainer>

          <FlexContainer marginBottom={`${theme.spacing.unit * 2}px`}>
            <Field
              name="parent_id"
              label="Parent"
              disabled={isSubmitting || isEditing}
              labelWidth={120}
              autoWidth
              component={SelectField}
            >
              <option key="none" value="" />
              {features.map((feature, index) => (
                <option key={index} value={feature.id}>
                  {feature.name}
                </option>
              ))}
            </Field>
          </FlexContainer>

          <FlexContainer marginBottom={`${theme.spacing.unit * 2}px`}>
            <Field
              name="data_type"
              label="Type"
              disabled={isSubmitting || isEditing}
              labelWidth={120}
              autoWidth
              component={SelectField}
            >
              <option key="none" value="" />
              {this.dataTypes.map((dataType, index) => (
                <option key={index} value={dataType.value}>
                  {dataType.key}
                </option>
              ))}
            </Field>
          </FlexContainer>

          <FlexContainer>
            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="button"
            >
              Submit
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
      </form>
    )
  }
}

FeatureDescriptionForm.propTypes = {
  isEditing: PropTypes.bool,
  featureCreate: PropTypes.func,
  data: PropTypes.object,
  isSubmitting: PropTypes.bool,
  handleSubmit: PropTypes.func,
  feature: PropTypes.object,
  initialize: PropTypes.func,
  router: PropTypes.object,
  theme: PropTypes.object
}

const ConnectFeatureDescriptionForm = reduxForm({
  form: 'FeatureDescriptionForm',
  validate: values => {
    const errors = {}

    if (!values.name) {
      errors.name = 'Name is a required field'
    }

    if (!values.data_type) {
      errors.data_type = 'Data type is a required field'
    }

    return errors
  }
})(FeatureDescriptionForm)

const FeaturesWithTheme = withTheme(ConnectFeatureDescriptionForm)

export default compose(
  withApollo,
  featureCreateMutation(),
  graphql(
    gql`
      query GetFeatures {
        features(filter: { parent_id: null }) {
          id
          name
        }
      }
    `
  ),
  withRouter
)(FeaturesWithTheme)

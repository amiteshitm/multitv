import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'react-apollo'
import { useRouter } from 'next/router'
import { reduxForm, FieldArray, arrayPush, formValueSelector } from 'redux-form'
import { addSuccess, addError } from 'redux-flash-messages'

import { makeStyles } from '@material-ui/core/styles'
import Select from 'react-select'

import Add from '@material-ui/icons/Add'
import Save from '@material-ui/icons/Save'
import { withTheme } from '@material-ui/styles'

import FlexContainer from 'components/shared/flex-container'
import Button from 'components/shared/button'
import { softwareUpdateMutation } from 'mutations/software/edit'
import FlashMessages from 'helpers/flash-messages'

import FeatureList from './list'

const StyledButton = styled(Button)`
  && {
    margin-top: ${props => `${props.theme.spacing(1)}px`};
    margin-bottom: ${props => `${props.theme.spacing(1)}px`};
  }
`

const isParent = feature => feature.parent === null || feature.parent === undefined
const isChild = feature => !isParent(feature)

// Remap Features to add value. Done to handle value from select.
const mapFeatures = features => features.map(f => mapFeature(f))

const mapFeature = feature => {
  if (feature.parent && feature.parent.id == null) {
    delete feature.parent
  }
  return { ...feature, value: feature, label: feature.name }
}

const SearchBar = ({ features, theme, onAddClick }) => {
  const selectStyles = {
    container: base => ({
      ...base,
      width: '50%',
      marginRight: theme.spacing(2),
    }),
    control: base => ({
      ...base,
      minHeight: theme.spacing(2.5),
    }),
    input: base => ({
      ...base,
      '& input': {
        font: 'inherit',
      },
    }),
  }

  const useStyles = makeStyles(theme => ({
    mr1: {
      marginRight: theme.spacing(1),
    },
  }))

  const [selectedFeature, setSelectedFeature] = useState(null)
  const classes = useStyles()

  const handleSelectChange = feature => setSelectedFeature(feature)

  const handleButtonClick = () => {
    onAddClick(selectedFeature.value)
    setSelectedFeature(null)
  }

  const featureOptions = mapFeatures(features)

  return (
    <FlexContainer justifyContent="space-between" alignItems="center">
      <Select value={selectedFeature} styles={selectStyles} onChange={handleSelectChange} options={featureOptions} />
      <div>
        <Button
          type="button"
          variant="contained"
          className={classes.mr1}
          color="primary"
          size="large"
          onClick={handleButtonClick}
        >
          <Add /> Add
        </Button>
        <StyledButton type="submit" variant="contained" color="primary" size="large">
          <Save /> Save
        </StyledButton>
      </div>
    </FlexContainer>
  )
}

SearchBar.propTypes = {
  features: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  onAddClick: PropTypes.func,
}

function Features ({ theme, software, softFeatures, handleSubmit, initialize, ...props }) {
  const catFeatures = software.root_category.features
  const router = useRouter()

  useEffect(() => {
    initialize({ software: { features: software.features } })
  }, [initialize, software])

  const searchFeatures =
    softFeatures &&
    catFeatures.filter(feature => {
      return softFeatures.findIndex(softFeature => softFeature.feature.id === feature.id) === -1
    })

  const addFeature = ({ label, ...feature }) => {
    const newFeatures = [feature]

    // If the parent is not present, add parent as well.
    if (isChild(feature) && softFeatures.findIndex(f => f.feature.id === feature.parent.id) === -1) {
      const { parent } = feature

      newFeatures.push(parent)
    }
    newFeatures.forEach(feature => props.pushArray('SoftwareFeaturesForm', 'software.features', { feature }))
  }

  const handleSaveButton = values => {
    const { softwareUpdate } = props

    const features = values.software.features.map(feature => {
      let data = feature.data

      if (
        (data === undefined || data == null) &&
        (feature.feature.data_type === 'Boolean' || isParent(feature.feature))
      ) {
        data = 'true'
      }
      return { feature: feature.feature.id, data }
    })

    softwareUpdate({ slug: software.slug, features })
      .then(result => {
        addSuccess({ text: 'Software was updated successfully' })
        router.push(`/admin/softwares/edit?slug=${software.slug}`)
      })
      .catch(error => {
        addError({ text: error.message })
      })
  }

  return (
    <FlexContainer direction="column">
      <FlashMessages />
      <form onSubmit={handleSubmit(handleSaveButton)}>
        <SearchBar features={searchFeatures} theme={theme} onAddClick={addFeature} />
        <FieldArray name="software.features" component={FeatureList} />
      </form>
    </FlexContainer>
  )
}

Features.propTypes = {
  theme: PropTypes.object.isRequired,
  softwareUpdate: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  software: PropTypes.object.isRequired,
  fields: PropTypes.object,
  softFeatures: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  pushArray: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('SoftwareFeaturesForm')
  const softFeatures = selector(state, 'software.features')

  return {
    softFeatures: softFeatures || [],
  }
}

const mapDispatchToProps = {
  // NOTE: This MUST be aliased or it will not work
  pushArray: arrayPush,
}

export default compose(
  softwareUpdateMutation(),
  reduxForm({
    form: 'SoftwareFeaturesForm',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTheme
)(Features)

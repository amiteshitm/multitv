import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import styled from 'styled-components'
import { withRouter } from 'next/router'

import { makeStyles } from '@material-ui/core/styles'
import Select from 'react-select'
import { addSuccess } from 'redux-flash-messages'

import Add from '@material-ui/icons/Add'
import Save from '@material-ui/icons/Save'
import { withTheme } from '@material-ui/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'

import FlexContainer from 'components/shared/flex-container'
import Button from 'components/shared/button'

import { categoryUpdateMutation } from 'mutations/category/edit'

const StyledPaper = styled(Paper)`
  margin-top: ${props => `${props.theme.spacing(2)}px`};
`

const StyledTableCell = styled(TableCell)`
  && {
    font-weight: ${props => (props.parent === true ? 500 : 400)};
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

const SearchBar = ({ features, theme, onAddClick, onSaveClick }) => {
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
          type="submit"
          variant="contained"
          className={classes.mr1}
          color="primary"
          size="large"
          onClick={handleButtonClick}
        >
          <Add /> Add
        </Button>
        <Button type="submit" variant="contained" color="primary" size="large" onClick={onSaveClick}>
          <Save /> Save
        </Button>
      </div>
    </FlexContainer>
  )
}

SearchBar.propTypes = {
  features: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  onAddClick: PropTypes.func,
  onSaveClick: PropTypes.func,
}

function FeatureList ({ catFeatures, onRemoveFeature }) {
  const handleCBChange = id => event => {
    if (event.target.checked === false) {
      const feature = catFeatures.find(f => f.id === id)

      onRemoveFeature(feature)
    }
  }

  const renderFeatureList = catFeatures
    .filter(f => isParent(f))
    .reduce((acc, feature) => {
      acc[feature.id] = [feature]

      return acc
    }, {})

  catFeatures
    .filter(f => !isParent(f))
    .forEach(feature => {
      renderFeatureList[feature.parent.id].push(feature)
    })

  return (
    <StyledPaper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(renderFeatureList).map(featureList =>
            featureList.map((f, index) => (
              <TableRow key={index}>
                <StyledTableCell parent={isParent(f)}>{f.name}</StyledTableCell>
                <TableCell>
                  <Checkbox value={f.id} checked={true} onChange={handleCBChange(f.id)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StyledPaper>
  )
}
FeatureList.propTypes = {
  catFeatures: PropTypes.array.isRequired,
  onRemoveFeature: PropTypes.func.isRequired,
}

function Features ({ data: { loading, allFeatures }, theme, category, ...props }) {
  const [catFeatures, setCatFeatures] = useState(category.features)
  const allFeaturesRef = useRef()

  if (loading) {
    return 'Loading ....'
  }

  allFeaturesRef.current = allFeatures

  const searchFeatures = allFeaturesRef.current.filter(feature => {
    return catFeatures.findIndex(catFeature => catFeature.id === feature.id) === -1
  })

  const addFeature = ({ label, ...feature }) => {
    const newFeatures = [feature]

    // If the parent is not present, add parent as well.
    if (isChild(feature) && catFeatures.findIndex(f => f.id === feature.parent.id) === -1) {
      newFeatures.push(feature.parent)
    }
    setCatFeatures(catFeatures => catFeatures.concat(newFeatures))
  }

  const removeFeature = feature => {
    let newFeatures = catFeatures.filter(catFeature => catFeature.id !== feature.id)

    if (isParent(feature)) {
      // Remove all the children as well.
      newFeatures = newFeatures.filter(catFeature => isParent(catFeature) || catFeature.parent.id !== feature.id)
    } else {
      // if this was the last child to be removed, remove the parent as well.
      if (newFeatures.filter(f => !isParent(f) && f.parent.id === feature.parent.id).length === 0) {
        newFeatures = newFeatures.filter(f => f.id !== feature.parent.id)
      }
    }
    setCatFeatures(newFeatures)
  }

  const handleSaveButton = () => {
    const { categoryUpdate, router } = props
    const { slug } = router.query

    const features = catFeatures.map(f => {
      if (f.parent !== null && f.parent !== undefined) {
        delete f.parent.__typename
      }

      delete f.__typename

      return f.id
    })

    categoryUpdate({ slug, features })
      .then(result => {
        addSuccess({ text: 'Category was updated successfully' })
        router.push('/admin/categories')
      })
      .catch(error => console.log(error))
  }

  return (
    <FlexContainer direction="column">
      <SearchBar features={searchFeatures} theme={theme} onAddClick={addFeature} onSaveClick={handleSaveButton} />
      <FeatureList catFeatures={catFeatures} onRemoveFeature={removeFeature} />
    </FlexContainer>
  )
}

Features.propTypes = {
  data: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  categoryUpdate: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
}

const GET_FEATURES = gql`
  query getFeatures {
    allFeatures: features {
      id
      data_type
      name
      parent {
        id
        name
      }
    }
  }
`

export default compose(
  withTheme,
  withRouter,
  categoryUpdateMutation(),
  graphql(GET_FEATURES)
)(Features)

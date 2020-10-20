import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Delete from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'

import Checkbox from 'helpers/form/check-box'
import TextField from 'helpers/form/text-field'

const StyledPaper = styled(Paper)`
  margin-top: ${props => `${props.theme.spacing(2)}px`};
`

const StyledTableCell = styled(TableCell)`
  && {
    font-weight: ${props => (props.parent === true ? 500 : 400)};
  }
`

const useStyles = makeStyles(theme => ({
  icon: {
    cursor: 'pointer',
  },
}))

const isParent = feature => feature.parent === null || feature.parent === undefined

const renderFeatures = ({ features, classes, fields, idx }) => {
  const handleCBChange = idx => (event, checked) => {
    if (checked === false) {
      fields.remove(idx)

      const feature = features.find(elem => elem.field_index === idx)

      fields.remove(feature.field_index)

      // If parent is removed, remove children as well
      if (isParent(feature)) {
        features.filter(f => !isParent(f) && f.parent.id === feature.id).forEach(f => fields.remove(f.field_index))
      }

      // if only parent is left without any children, remove that as well
      if (!isParent(feature)) {
        const children = features.filter(f => !isParent(f) && f.parent.id === feature.id).length

        if (children.length === 1) {
          features.filter(feature => feature.id === children[0].parent.id).forEach(f => fields.remove(f.field_index))
        }
      }
      // Stop the redux-form change event to fire, or we will get the same field back with just the value
      // of checkbox.
      event.preventDefault()
    }
  }

  return (
    <Fragment key={idx}>
      {features.map(f => (
        <TableRow key={f.id}>
          <StyledTableCell parent={isParent(f)}>{f.name}</StyledTableCell>
          <TableCell>
            {f.data_type !== 'String' && (
              <Field
                id={f.id}
                name={`${f.field_name}.data`}
                checked={true}
                defaultValue={true}
                component={Checkbox}
                onChange={handleCBChange(f.field_index)}
              />
            )}
            {f.data_type === 'String' && (
              <Field id={f.id} name={`${f.field_name}.data`} label="Name" component={TextField} margin="normal" />
            )}
          </TableCell>
          <TableCell>
            <Delete className={classes.icon} />
          </TableCell>
        </TableRow>
      ))}
    </Fragment>
  )
}

renderFeatures.propTypes = {
  fields: PropTypes.object.isRequired,
  features: PropTypes.array.isRequired,
  classes: PropTypes.object,
  idx: PropTypes.number,
}

function FeatureList ({ fields }) {
  const classes = useStyles()

  const renderFeatureList = fields.reduce((acc, name, index, fields) => {
    const feature = fields.get(index).feature

    if (isParent(feature)) {
      acc[feature.id] = [{ ...feature, field_name: name, field_index: index }]
    }

    return acc
  }, {})

  fields.forEach((name, index, fields) => {
    const feature = fields.get(index).feature

    if (!isParent(feature)) {
      renderFeatureList[feature.parent.id].push({ ...feature, field_name: name, field_index: index })
    }
  })

  return (
    <StyledPaper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(renderFeatureList).map((features, idx) => renderFeatures({ features, classes, fields, idx }))}
        </TableBody>
      </Table>
    </StyledPaper>
  )
}

FeatureList.propTypes = {
  fields: PropTypes.object.isRequired,
}

export default FeatureList

import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import FlashMessages from 'helpers/flash-messages'
import FlexContainer from 'components/shared/flex-container'

import AdminLayout from 'layouts/admin'
import { NextButtonLink } from 'shared/util'
import { withApollo } from 'util/apollo'

const RightAlignedDiv = styled.div`
  margin-left: auto;
`

const StyledPaper = styled(Paper)`
  margin-top: ${props => `${props.theme.spacing(2)}px`};
`

const FeaturesList = ({ features }) => {
  let featuresHtml = (
    <StyledPaper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Parent</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((s, index) => (
            <TableRow key={index}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.parent && s.parent.name}</TableCell>
              <TableCell>{s.data_type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledPaper>
  )

  return featuresHtml
}

function AdminFeatures () {
  const { loading, data } = useQuery(GET_FEATURES)

  if (loading) return 'Loading ...'

  const { features } = data

  return (
    <AdminLayout>
      <div>
        <FlashMessages />
        <FlexContainer flexBasis={'50%'}>
          <Typography variant="h5">Features</Typography>
          <RightAlignedDiv>
            <NextButtonLink href="/admin/features/new">
              <Button color="primary" variant="contained" size="small">
                <Add /> Add New Feature
              </Button>
            </NextButtonLink>
          </RightAlignedDiv>
        </FlexContainer>
        <FeaturesList features={features} />
      </div>
    </AdminLayout>
  )
}

AdminFeatures.propTypes = {
  data: PropTypes.object.isRequired,
}

AdminFeatures.fragments = {
  features: gql`
    fragment AdminFeatures on Feature {
      id
      data_type
      name
      parent {
        id
        name
      }
    }
  `,
}

const GET_FEATURES = gql`
  query GetFeatures {
    features {
      ...AdminFeatures
    }
  }
  ${AdminFeatures.fragments.features}
`

export default withApollo(AdminFeatures)

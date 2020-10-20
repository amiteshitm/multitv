import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'
import Create from '@material-ui/icons/Create'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import FlashMessages from 'helpers/flash-messages'

import AdminLayout from 'layouts/admin'
import { NextButtonLink } from 'shared/util'
import FlexContainer from 'components/shared/flex-container'
import { withApollo } from 'util/apollo'

const StyledPaper = styled(Paper)`
  margin-top: ${(props) => `${props.theme.spacing(2)}px`};
`

const RightAlignedDiv = styled.div`
  margin-left: auto;
`

const useStyles = makeStyles((theme) => ({
  icon: {
    cursor: 'pointer',
  },
}))

const SoftwaresList = (props) => {
  let softwaresHtml = (
    <StyledPaper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.softwares.map((s) => (
            <TableRow key={s.slug}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.slug}</TableCell>
              <TableCell>
                <Link href={`/admin/softwares/edit?slug=${s.slug}`}>
                  <Create className={props.classes.icon} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledPaper>
  )

  return softwaresHtml
}

const AdminSoftwares = () => {
  const classes = useStyles()

  const { loading, data } = useQuery(GET_SOFTWARES, { variables: { sort: 'UPDATED_AT_DESC' } })

  if (loading) {
    return 'Loading ...'
  }

  const { softwareMany: softwares } = data

  return (
    <AdminLayout>
      <div>
        <FlashMessages />
        <FlexContainer flexBasis={'50%'}>
          <Typography variant="h5">Softwares</Typography>
          <RightAlignedDiv>
            <NextButtonLink href="/admin/softwares/new">
              <Button color="primary" variant="contained" size="small">
                <Add /> Add New Software
              </Button>
            </NextButtonLink>
          </RightAlignedDiv>
        </FlexContainer>
        <SoftwaresList softwares={softwares} classes={classes} />
      </div>
    </AdminLayout>
  )
}

const GET_SOFTWARES = gql`
  query GetSoftwares($filter: FilterFindManySoftwareInput, $skip: Int, $sort: SortFindManySoftwareInput) {
    softwareMany(filter: $filter, skip: $skip, sort: $sort) {
      name
      slug
      desc
      website
    }
  }
`
export default withApollo(AdminSoftwares)

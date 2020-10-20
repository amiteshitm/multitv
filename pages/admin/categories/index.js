import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { compose } from 'react-apollo'

import Link from 'next/link'

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

import FlexContainer from 'components/shared/flex-container'
import FlashMessages from 'helpers/flash-messages'

import AdminLayout from 'layouts/admin'
import { NextButtonLink } from 'shared/util'
import { withApollo } from 'util/apollo'
import { useQuery } from '@apollo/react-hooks'

const RightAlignedDiv = styled.div`
  margin-left: auto;
`

const StyledPaper = styled(Paper)`
  margin-top: ${props => `${props.theme.spacing(2)}px`};
`

const useStyles = makeStyles(theme => ({
  icon: {
    cursor: 'pointer',
  },
}))

const CategoriesList = props => {
  let categoriesHtml = (
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
          {props.categories.map((s, index) => (
            <TableRow key={index}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.slug}</TableCell>
              <TableCell>
                <Link href={`/admin/categories/edit?slug=${s.slug}`}>
                  <Create className={props.classes.icon} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledPaper>
  )

  return categoriesHtml
}

function AdminCategories () {
  const { loading, data } = useQuery(GET_CATEGORIES)
  const classes = useStyles()

  if (loading) return 'Loading ...'

  const { categoryMany: categories } = data

  return (
    <AdminLayout>
      <div>
        <FlashMessages />
        <FlexContainer flexBasis={'50%'}>
          <Typography variant="h5">Categories</Typography>
          <RightAlignedDiv>
            <NextButtonLink href="/admin/categories/new">
              <Button color="primary" variant="contained" size="small">
                <Add /> Add New Category
              </Button>
            </NextButtonLink>
          </RightAlignedDiv>
        </FlexContainer>
        <CategoriesList categories={categories} classes={classes} />
      </div>
    </AdminLayout>
  )
}

AdminCategories.propTypes = {
  data: PropTypes.object,
  classes: PropTypes.object,
}

const GET_CATEGORIES = gql`
  {
    categoryMany {
      name
      slug
    }
  }
`
export default compose(withApollo)(AdminCategories)

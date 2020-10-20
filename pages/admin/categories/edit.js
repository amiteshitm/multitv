import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DescriptionIcon from '@material-ui/icons/Description'
import LayersIcon from '@material-ui/icons/Layers'

import NewCategoryForm from 'components/admin/categories/new.form'
import Features from 'components/admin/categories/features'

import TabContainer from 'components/shared/tab-container'
import FlashMessages from 'helpers/flash-messages'
import AdminLayout from 'layouts/admin'
import { withApollo } from 'util/apollo'

function AdminCategoriesEdit (props) {
  const [tabId, setTabId] = useState(0)
  const router = useRouter()

  const { loading, data } = useQuery(GET_CATEGORY, {
    variables: { filter: { slug: router.query.slug } },
  })

  if (loading) return null

  const handleTabChange = (event, tabId) => {
    setTabId(tabId)
  }

  const { categoryOne: category } = data

  return (
    <AdminLayout>
      <FlashMessages />
      <Tabs value={tabId} onChange={handleTabChange}>
        <Tab icon={<DescriptionIcon />} label="DESCRIPTION" />
        <Tab icon={<LayersIcon />} label="FEATURES" />
      </Tabs>
      {tabId === 0 && (
        <TabContainer>
          <NewCategoryForm dispatch={props.dispatch} category={category} isEditing={true} />
        </TabContainer>
      )}
      {tabId === 1 && (
        <TabContainer>
          <Features dispatch={props.dispatch} category={category} isEditing={true} />
        </TabContainer>
      )}
    </AdminLayout>
  )
}

const GET_CATEGORY = gql`
  query GetCategory($filter: FilterFindOneCategoryInput) {
    categoryOne(filter: $filter) {
      name
      slug
      desc
      details
      parent_id
      features {
        id
        name
        data_type
        parent {
          id
          name
          data_type
        }
      }
    }
  }
`

AdminCategoriesEdit.propTypes = {
  data: PropTypes.object,
  dispatch: PropTypes.func,
}

export default compose(withApollo)(AdminCategoriesEdit)

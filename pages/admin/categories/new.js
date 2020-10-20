import React, { Component } from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DescriptionIcon from '@material-ui/icons/Description'

import NewCategoryForm from 'components/admin/categories/new.form'
import TabContainer from 'components/shared/tab-container'

import FlashMessages from 'helpers/flash-messages'
import AdminLayout from 'layouts/admin'
import { withApollo } from 'util/apollo'

class AdminCategoriesNew extends Component {
  state = {
    tabId: 0,
  }

  componentDidMount () {}

  componentWillUnmount () {}

  handleTabChange = (event, tabId) => {
    this.setState({ tabId })
  }

  render () {
    const { tabId } = this.state

    return (
      <AdminLayout>
        <FlashMessages />
        <Tabs value={tabId} onChange={this.handleTabChange}>
          <Tab icon={<DescriptionIcon />} label="DESCRIPTION" />
          <Tab icon={<DescriptionIcon />} label="Uploads" />
        </Tabs>
        {tabId === 0 && (
          <TabContainer>
            <NewCategoryForm dispatch={this.props.dispatch} isEditing={false} onSubmit={this.submit} />
          </TabContainer>
        )}
      </AdminLayout>
    )
  }
}

export default withApollo(AdminCategoriesNew)

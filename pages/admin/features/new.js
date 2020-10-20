import React, { Component } from 'react'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DescriptionIcon from '@material-ui/icons/Description'

import NewFeatureForm from 'components/admin/features/new.form'

import FlashMessages from 'helpers/flash-messages'
import AdminLayout from 'layouts/admin'

class AdminFeaturesNew extends Component {
  state = {
    tabId: 0,
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  handleTabChange = (event, tabId) => {
    this.setState({ tabId })
  }

  render () {
    const { tabId } = this.state

    return (
      <AdminLayout>
        <FlashMessages />
        <Tabs value={tabId} onChange={this.handleTabChange}>
          <Tab
            icon={<DescriptionIcon />}
            label="DESCRIPTION"
          >
          </Tab>
        </Tabs>
        {tabId === 0 &&
          <div>
            <NewFeatureForm dispatch={this.props.dispatch}
              isEditing={false}
              onSubmit={this.submit} />
          </div>
        }
      </AdminLayout>
    )
  }
}

export default AdminFeaturesNew

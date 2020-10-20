import React, { Component } from 'react'
import omit from 'lodash/omit'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DescriptionIcon from '@material-ui/icons/Description'

import NewSoftwareForm from 'components/admin/softwares/new.form'
import { addSoftwareRequest, updateSoftwareRequest } from 'actions/software-actions'

import TabContainer from 'components/shared/tab-container'
import FlashMessages from 'helpers/flash-messages'
import AdminLayout from 'layouts/admin'
import { withApollo } from 'util/apollo'

class AdminSoftwaresNew extends Component {
  state = {
    tabId: 0,
  }

  componentDidMount () {}

  componentWillUnmount () {}

  handleTabChange = (event, tabId) => {
    this.setState({ tabId })
  }

  submit = values => {
    this.props.dispatch(addSoftwareRequest({ software: omit(values, '_id') }))
  }

  icoSubmit = values => {
    this.props.dispatch(updateSoftwareRequest({ software: values }))
  }

  teamSubmit = values => {
    this.props.dispatch(updateSoftwareRequest({ software: values }))
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
            <NewSoftwareForm dispatch={this.props.dispatch} isEditing={false} onSubmit={this.submit} />
          </TabContainer>
        )}
      </AdminLayout>
    )
  }
}

export default withApollo(AdminSoftwaresNew)

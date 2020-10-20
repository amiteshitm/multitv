import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import DescriptionIcon from '@material-ui/icons/Description'
import LayersIcon from '@material-ui/icons/Layers'

import NewSoftwareForm from 'components/admin/softwares/new.form'
import TabContainer from 'components/shared/tab-container'
import { addSoftwareRequest, updateSoftwareRequest } from 'actions/software-actions'

import FlashMessages from 'helpers/flash-messages'
import AdminLayout from 'layouts/admin'
import UploadForm from 'components/admin/softwares/upload.form'
import FeaturesForm from 'components/admin/softwares/features'
import { withApollo } from 'util/apollo'

class AdminSoftwaresEdit extends Component {
  state = {
    tabId: 0,
  }

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

  componentDidMount () {}

  render () {
    const { tabId } = this.state
    const {
      data: { loading, softwareOne: software },
    } = this.props

    if (loading) return null

    return (
      <AdminLayout>
        <FlashMessages />
        <Tabs value={tabId} onChange={this.handleTabChange}>
          <Tab icon={<DescriptionIcon />} label="DESCRIPTION" />
          <Tab icon={<DescriptionIcon />} label="Uploads" />
          <Tab icon={<LayersIcon />} label="Features" />
        </Tabs>
        {tabId === 0 && (
          <TabContainer>
            <NewSoftwareForm
              dispatch={this.props.dispatch}
              software={software}
              isEditing={true}
              onSubmit={this.submit}
            />
          </TabContainer>
        )}
        {tabId === 1 && (
          <TabContainer>
            <UploadForm
              dispatch={this.props.dispatch}
              software={software}
              isEditing={false}
              onSubmit={this.uploadFiles}
            />
          </TabContainer>
        )}
        {tabId === 2 && (
          <TabContainer>
            <FeaturesForm dispatch={this.props.dispatch} software={software} isEditing={true} />
          </TabContainer>
        )}
      </AdminLayout>
    )
  }
}

AdminSoftwaresEdit.fragments = {
  feature_embed: gql`
    fragment AdminSoftwaresFeatureEmbed on FeatureEmbed {
      data
      feature {
        id
        name
        data_type
        parent {
          id
          name
        }
      }
    }
  `,
}

const GET_SOFTWARE = gql`
  query GetSoftware($filter: FilterFindOneSoftwareInput, $skip: Int, $sort: SortFindOneSoftwareInput) {
    softwareOne(filter: $filter, skip: $skip, sort: $sort) {
      _id
      name
      slug
      desc
      details
      website
      twitter
      reddit
      medium
      github
      root_category_id
      pricing
      root_category {
        _id
        features {
          id
          name
          data_type
          parent {
            id
            name
          }
        }
      }
      categories
      tags
      apps
      features {
        ...AdminSoftwaresFeatureEmbed
      }
      ...SoftwareUploads
      ...SoftwareLogo
    }
  }
  ${UploadForm.fragments.upload}
  ${UploadForm.fragments.logo}
  ${AdminSoftwaresEdit.fragments.feature_embed}
`

AdminSoftwaresEdit.propTypes = {
  data: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
}

export default compose(
  withRouter,
  withApollo,
  graphql(GET_SOFTWARE, {
    options: props => {
      return { variables: { filter: { slug: props.router.query.slug } } }
    },
  })
)(AdminSoftwaresEdit)

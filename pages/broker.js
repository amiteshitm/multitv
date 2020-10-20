import React from 'react'
import { compose } from 'redux'
import gql from 'graphql-tag'

import { useRouter } from 'next/router'
import Head from 'next/head'
import getConfig from 'next/config'

import { useQuery } from '@apollo/react-hooks'

import withApollo from 'util/apollo'
import ApplicationLayout from 'layouts/application'
import BrokerContent from 'components/broker'

const { publicRuntimeConfig } = getConfig()

const GET_BROKER = gql`
  query brokers($where: JSON) {
    brokers(where: $where) {
      name
      slug
      details
      broker_type
      account_opening_process
      demat
      trading_account
      exchanges {
        bse
        nse
        mcx
        ncdex
      }
      trading_options {
        equity
        fno
        currency
        commodity
      }
      account_opening_charges {
        opening_charges
        trading_amc
        demat_amc
      }
      consolidated_charges {
        equity_delivery
        equity_intraday
        equity_futures
        equity_options
        currency_futures
        currency_options
        commodity
        mutual_fund
      }
      equity_delivery_brokerage {
        brokerage
        stt
        turnover
        gst
        sebi
        stamp
      }
      equity_intraday_brokerage {
        brokerage
        stt
        turnover
        gst
        sebi
        stamp
      }
    }
  }
`

const title = ({ broker }) => {
  return ` ${
    broker.name
  } broker trading and demat account reviews, charges ${new Date().getFullYear()}`
}

const description = ({ broker }) => {
  return `${
    broker.name
  } trading and demat account reviews, charges, margin ${new Date().getFullYear()}`
}

function Broker() {
  const router = useRouter()
  const { loading: brokerLoading, data: brokerData } = useQuery(GET_BROKER, {
    variables: { where: { slug: router.query.slug } }
  })

  if (brokerLoading) {
    return 'Loading ...'
  }

  const { brokers } = brokerData
  const broker = brokers[0]

  return (
    <ApplicationLayout>
      <Head>
        <title>{title({ broker })}</title>
        <meta name="description" content={description({ broker })} />
      </Head>
      <BrokerContent broker={broker} />
    </ApplicationLayout>
  )
}

export default compose(
  withApollo(Broker, { uri: publicRuntimeConfig.cmsGraphql })
)

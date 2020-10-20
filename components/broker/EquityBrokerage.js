import React from 'react'
import PropTypes from 'prop-types'

import { Table, Typography } from 'antd'

const columns = [
  {
    title: 'Trading Segment',
    dataIndex: 'segment',
    render: text => <a>{text}</a>
  },
  {
    title: 'Broker Charges',
    className: 'column-money',
    dataIndex: 'money',
    align: 'right'
  }
]

const keyNameMap = {
  equity_delivery: 'Equity Delivery',
  equity_intraday: 'Equity Intraday',
  equity_futures: 'Equity Futures',
  equity_options: 'Equity Options',
  currency_futures: 'Currency Futures',
  currency_options: 'Currency Options',
  commodity: 'Commodity',
  mutual_fund: 'Mutual Fund'
}

export default function EquityBrokerage({ broker }) {
  const { Title } = Typography
  const { name, consolidated_charges: charges } = broker

  if (!charges) return

  const data = Object.keys(charges)
    .filter(k => k !== '__typename')
    .map(k => ({
      segment: keyNameMap[k] || k,
      money: charges[k]
    }))

  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      title={() => (
        <Title level={2}>
          {name} Brokerage Charges: {new Date().getFullYear()}
        </Title>
      )}
      pagination={false}
    />
  )
}

EquityBrokerage.propTypes = {
  broker: PropTypes.object.isRequired
}

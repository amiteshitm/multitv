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
    title: 'Equity Delivery',
    className: 'column-money',
    dataIndex: 'delivery',
    align: 'right'
  },
  {
    title: 'Equity Interaday',
    className: 'column-money',
    dataIndex: 'intraday',
    align: 'right'
  }
]

const keyNameMap = {
  brokerage: 'Brokerage',
  stt: 'Securities Transaction Tax (STT)',
  turnover: 'Transaction / Turnover Charges',
  gst: 'Goods and Services Tax (GST)',
  sebi: 'SEBI Charges',
  stamp: 'Stamp Charges'
}

export default function ConsolidatedCharges({ broker }) {
  const { Title } = Typography
  const {
    name,
    equity_delivery_brokerage: delivery_brokerage,
    equity_intraday_brokerage: intraday_brokerage
  } = broker

  if (!delivery_brokerage) return

  const data = Object.keys(delivery_brokerage)
    .filter(k => k !== '__typename')
    .map(k => ({
      segment: keyNameMap[k],
      delivery: delivery_brokerage[k],
      intraday: intraday_brokerage[k]
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

ConsolidatedCharges.propTypes = {
  broker: PropTypes.object.isRequired
}

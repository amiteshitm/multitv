import React from 'react'
import PropTypes from 'prop-types'

import { Table, Typography } from 'antd'

const columns = [
  {
    title: 'Charge',
    dataIndex: 'charge',
    render: text => <a>{text}</a>
  },
  {
    title: 'Amount',
    className: 'column-money',
    dataIndex: 'money',
    align: 'right'
  }
]

const keyNameMap = {
  opening_charges: 'Demat & Trading Account Opening Charge',
  trading_amc: 'Trading Account AMC',
  demat_amc: 'Demat Account AMC'
}

export default function AcccountOpeningCharges({ broker }) {
  const { Title } = Typography
  const { name, account_opening_charges: charges } = broker

  if (!charges) return

  const data = Object.keys(charges)
    .filter(k => k !== '__typename')
    .map(k => ({
      charge: keyNameMap[k] || k,
      money: charges[k]
    }))

  return (
    <Table
      columns={columns}
      dataSource={data}
      bordered
      title={() => (
        <Title level={2}>
          {name} Account Opening Charges: {new Date().getFullYear()}
        </Title>
      )}
      pagination={false}
    />
  )
}

AcccountOpeningCharges.propTypes = {
  broker: PropTypes.object.isRequired
}

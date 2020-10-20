import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Row, Col } from 'antd'
import Button from 'components/shared/button'

import BrokerDetails from 'components/broker/BrokerDetails'
import AccountOpeningProcess from 'components/broker/AccountOpeningProcess'
import AccountOpeningCharges from 'components/broker/AccountOpeningCharges'
import ConsolidatedCharges from 'components/broker/ConsolidatedCharges'

import 'assets/broker.less'

const header = ({ broker }) => {
  return `${
    broker.name
  }: Trading & Demat Account, Reviews, Charges: ${new Date().getFullYear()}`
}

export default function Broker({ broker }) {
  const { details } = broker
  const { Title } = Typography

  return (
    <Row className="page-wrapper page">
      <Col xs={24} md={16}>
        <Title className="title-wrapper">{header({ broker })}</Title>
        <BrokerDetails details={details} />
        <Row className="row-wrapper">
          <Col>
            <Button size="large" type="primary">
              Open FREE Equity Investment Account
            </Button>
          </Col>
        </Row>
        <Row className="row-wrapper">
          <AccountOpeningCharges broker={broker} />
        </Row>
        <Row className="row-wrapper">
          <AccountOpeningProcess broker={broker} />
        </Row>
        <Row className="row-wrapper">
          <ConsolidatedCharges broker={broker} />
        </Row>
      </Col>
      <Col xs={24} md={8} />
    </Row>
  )
}

Broker.propTypes = {
  broker: PropTypes.object.isRequired
}

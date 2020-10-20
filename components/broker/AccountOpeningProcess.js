import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

import { Typography } from 'antd'

export default function AccountOpeningProcess({ broker }) {
  const { Title } = Typography
  const { name, account_opening_process: accountOpeningProcess } = broker

  if (!accountOpeningProcess) return

  return (
    <>
      <Title level={2} className="title-wrapper">
        {name} Account Opening Process
      </Title>
      <ReactMarkdown source={accountOpeningProcess} />
    </>
  )
}

AccountOpeningProcess.propTypes = {
  broker: PropTypes.object.isRequired
}

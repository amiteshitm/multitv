import React from 'react'
import PropTypes from 'prop-types'

import capitalize from 'lodash/capitalize'

import { Button } from 'antd'
import Link from 'next/link'

const NextButtonLink = itemProps => (
  <Link href={itemProps.href}>{itemProps.children}</Link>
)

const isParent = feature =>
  feature.parent === null || feature.parent === undefined
const isChild = feature => !isParent(feature)

const NextLink = ({ href, children, as }) => (
  <Link href={href} as={as}>
    {children}
  </Link>
)

NextLink.propTypes = {
  href: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  as: PropTypes.string.isRequired
}

const capitalizeText = text =>
  text.split(' ').reduce((acc, val) => `${acc} ${capitalize(val)}`, '')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const isImg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/
export const getChildrenToRender = (item, i) => {
  let tag = item.name.indexOf('title') === 0 ? 'h1' : 'div'
  tag = item.href ? 'a' : tag
  let children =
    typeof item.children === 'string' && item.children.match(isImg)
      ? React.createElement('img', { src: item.children, alt: 'img' })
      : item.children
  if (item.name.indexOf('button') === 0 && typeof item.children === 'object') {
    children = React.createElement(Button, {
      ...item.children
    })
  }
  return React.createElement(tag, { key: i.toString(), ...item }, children)
}

export { NextButtonLink, NextLink, isParent, isChild, capitalizeText, delay }

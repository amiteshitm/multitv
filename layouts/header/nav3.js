import React, { useState } from 'react'
import TweenOne from 'rc-tween-one'
import { Menu } from 'antd'

import Link from 'next/link'

import 'assets/nav3.less'
import { getChildrenToRender } from 'shared/util'

const { Item, SubMenu } = Menu

const dataSource = {
  wrapper: { className: 'header3 home-page-wrapper' },
  page: { className: 'home-page' },
  logo: {
    className: 'header3-logo',
    children:
      'https://gw.alipayobjects.com/zos/basement_prod/b30cdc2a-d91c-4c78-be9c-7c63b308d4b3.svg'
  },
  Menu: {
    className: 'header3-menu',
    children: [
      {
        name: 'item0',
        className: 'header3-item',
        children: {
          href: '#',
          children: [{ children: 'Brokers', name: 'text' }]
        },
        subItem: [
          {
            name: 'sub0',
            className: 'item-sub',
            children: {
              className: 'item-sub-item',
              children: [
                {
                  name: 'image0',
                  className: 'item-image',
                  children:
                    'https://gw.alipayobjects.com/zos/rmsportal/ruHbkzzMKShUpDYMEmHM.svg'
                },
                {
                  name: 'title',
                  className: 'item-title',
                  children: 'Zerodha'
                },
                {
                  name: 'content',
                  className: 'item-content',
                  children: 'Zerodha Reviews'
                }
              ]
            }
          }
        ]
      },
      {
        name: 'item1',
        className: 'header3-item',
        children: {
          href: '#',
          children: [{ children: 'IPO', name: 'text' }]
        }
      },
      {
        name: 'item2',
        className: 'header3-item',
        children: {
          href: '#',
          children: [{ children: 'Calculators', name: 'text' }]
        }
      }
    ]
  },
  mobileMenu: { id: 'mobile-ham', className: 'header3-mobile-menu' }
}

const NavHam = ({ phoneClick, isMobile }) => {
  if (!isMobile) return <></>
  return (
    <div
      {...dataSource.mobileMenu}
      onClick={() => {
        phoneClick()
      }}
    >
      <em />
      <em />
      <em />
    </div>
  )
}

const Header3 = ({ isMobile, ...props }) => {
  const [phoneOpen, setPhoneOpen] = useState(undefined)

  const phoneClick = () => {
    setPhoneOpen(!phoneOpen)
  }

  const navData = dataSource.Menu.children
  const HeaderTitle = ({ a }) => (
    <div {...a} className={`header3-item-block ${a.className}`.trim()}>
      {a.children.map(getChildrenToRender)}
    </div>
  )

  const navChildren = navData.map(item => {
    const { children: a, subItem, ...itemProps } = item
    if (subItem) {
      return (
        <SubMenu
          key={item.name}
          {...itemProps}
          title={<HeaderTitle a={a} />}
          popupClassName="header3-item-child"
        >
          {subItem.map(($item, ii) => {
            const { children: childItem } = $item
            const child = childItem.href ? (
              <a {...childItem}>
                {childItem.children.map(getChildrenToRender)}
              </a>
            ) : (
              <div {...childItem}>
                {childItem.children.map(getChildrenToRender)}
              </div>
            )
            return (
              <Item key={$item.name || ii.toString()} {...$item}>
                {child}
              </Item>
            )
          })}
        </SubMenu>
      )
    }
    return (
      <Item key={item.name} {...itemProps}>
        <a {...a} className={`header3-item-block ${a.className}`.trim()}>
          {a.children.map(getChildrenToRender)}
        </a>
      </Item>
    )
  })

  const moment = phoneOpen === undefined ? 300 : null

  return (
    <TweenOne
      component="header"
      animation={{ opacity: 0, type: 'from' }}
      {...dataSource.wrapper}
      {...props}
    >
      <div
        {...dataSource.page}
        className={`${dataSource.page.className}${phoneOpen ? ' open' : ''}`}
      >
        <TweenOne
          animation={{ x: -30, type: 'from', ease: 'easeOutQuad' }}
          {...dataSource.logo}
        >
          <Link href="/">
            <a>
              <img width="100%" src={dataSource.logo.children} alt="img" />
            </a>
          </Link>
        </TweenOne>
        <NavHam phoneClick={phoneClick} isMobile={isMobile} />
        <TweenOne
          {...dataSource.Menu}
          animation={
            isMobile
              ? {
                  x: 0,
                  height: 0,
                  duration: 300,
                  onComplete: e => {
                    if (phoneOpen) {
                      e.target.style.height = 'auto'
                    }
                  },
                  ease: 'easeInOutQuad'
                }
              : null
          }
          moment={moment}
          reverse={!!phoneOpen}
        >
          <Menu
            mode={isMobile ? 'inline' : 'horizontal'}
            defaultSelectedKeys={['sub0']}
            theme="light"
          >
            {navChildren}
          </Menu>
        </TweenOne>
      </div>
    </TweenOne>
  )
}

export default Header3

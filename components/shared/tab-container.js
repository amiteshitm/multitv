import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { withTheme } from '@material-ui/styles'

const StyledDiv = styled.div`
  padding: ${props => `${props.theme.spacing.unit * 2}px`};
`

const TabContainer = ({ theme, children }) =>
  <StyledDiv theme={theme}>
    {children}
  </StyledDiv>

TabContainer.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

export default withTheme(TabContainer)

import { css } from 'styled-components'

export const mediaQuery = (query, innerCss) => css`
  ${query} {
    ${innerCss}
  }
`

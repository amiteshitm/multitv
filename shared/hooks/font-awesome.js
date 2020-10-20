import React from 'react'
import { loadCSS } from 'fg-loadcss'

export default function useFontAwesome () {
  React.useEffect(() => {
    loadCSS('https://use.fontawesome.com/releases/v5.11.2/css/all.css', document.querySelector('#loadcss'))
  }, [])
}

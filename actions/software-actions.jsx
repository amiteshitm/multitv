// import { browserHistory } from 'react-router'
import { addSuccess, addError } from 'redux-flash-messages'

import callApi from 'helpers/api-caller'

// Export Constants
export const SOFTWARE_ADD_START = 'SOFTWARE_ADD_START'
export const SOFTWARE_ADD_END = 'SOFTWARE_ADD_END'
export const SOFTWARE_ADD = 'SOFTWARE_ADD'
export const SOFTWARE_UPDATE = 'SOFTWARE_UPDATE'
export const SOFTWARES_ADD = 'SOFTWARES_ADD'

// Export Actions
function startAddSoftware () {
  return { type: SOFTWARE_ADD_START }
}

function endAddSoftware () {
  return { type: SOFTWARE_ADD_END }
}

export function addSoftware (data) {
  return {
    type: SOFTWARE_ADD,
    data,
  }
}

export function updateSoftware (data) {
  return {
    type: SOFTWARE_UPDATE,
    data,
  }
}

export function addSoftwares (softwares) {
  return {
    type: SOFTWARE_UPDATE,
    softwares,
  }
}

export function fetchSoftware (cuid) {
  return (dispatch) => {
    return callApi(`softwares/${cuid}`).then(res => dispatch(addSoftware(res.software)))
  }
}

// Get the Coins List for Display.
export function getSoftwaresList () {
  return (dispatch) => {
    return callApi(`softwares`).then(res => dispatch(addSoftwares(res.softwares)))
  }
}

export function addSoftwareRequest (software, token) {
  return (dispatch) => {
    dispatch(startAddSoftware())

    return callApi('admin/softwares', 'post', software, token)
      .then(res => {
        if (res.success) {
          dispatch(updateSoftware(res.software))
          addSuccess({ text: 'Software Added Successfully' })
          // browserHistory.push('/admin/softwares')
        } else {
          dispatch(endAddSoftware())
          addError({ text: 'Error:' + res.message })
        }
      })
      .catch(res => {
        dispatch(endAddSoftware())
        addError({ text: res.message })
      })
  }
}

export function updateSoftwareRequest (software, token) {
  return (dispatch) => {
    dispatch(startAddSoftware())

    return callApi('admin/softwares', 'put', software, token)
      .then(res => {
        if (res.success) {
          dispatch(updateSoftware(res.software))
          addSuccess({ text: 'Software Updated Successfully' })
          // browserHistory.push('/admin/softwares')
        } else {
          dispatch(endAddSoftware())
          addError({ text: 'Error:' + res.message })
        }
      })
      .catch(res => {
        dispatch(endAddSoftware())
        addError({ text: res.message })
      })
  }
}

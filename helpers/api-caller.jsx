import fetch from 'isomorphic-fetch'
import getConfig from 'next/config'
import Auth from './Auth.js'

// Only holds serverRuntimeConfig and publicRuntimeConfig from next.config.js nothing else.
const { publicRuntimeConfig } = getConfig()

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test')
  ? process.env.BASE_URL || (`http://localhost:${process.env.PORT || publicRuntimeConfig.port}/api`)
  : '/api'

export default function callApi (endpoint, method = 'get', data, token = null) {
  let body = {
    headers: { 'content-type': 'application/json' },
    method,
  }
  let authToken = Auth.getToken()
  if (authToken) {
    body.headers.authorization = `Bearer ${authToken}`
  }

  if (method !== 'get' && data) {
    body.body = JSON.stringify(data)
  }

  return fetch(`${API_URL}/${endpoint}`, body)
    .then(response => {
      if (response.status === 401) {
        // return browserHistory.push('/user/signout?sp=' + browserHistory.getCurrentLocation().pathname)
      }
      return response.json().then(json => ({ json, response }))
    })
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }

      return json
    })
    .then(
      response => response,
      error => error
    )
}

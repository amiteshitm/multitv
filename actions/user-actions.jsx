import callApi from '../helpers/api-caller'
import { addSuccess, addError } from 'redux-flash-messages'
// export constants
export const MANUAL_LOGIN_USER = 'MANUAL_LOGIN_USER'
export const LOGIN_SUCCESS_USER = 'LOGIN_SUCCESS_USER'
export const LOGIN_ERROR_USER = 'LOGIN_ERROR_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const LOGOUT_SUCCESS_USER = 'LOGOUT_SUCCESS_USER'
export const LOGOUT_ERROR_USER = 'LOGOUT_ERROR_USER'
export const REGISTER_USER = 'REGISTER_USER'
export const REGISTER_SUCCESS_USER = 'REGISTER_SUCCESS_USER'
export const REGISTER_ERROR_USER = 'REGISTER_ERROR_USER'
export const SET_USER = 'SET_USER'

function beginLogin () {
  return { type: MANUAL_LOGIN_USER }
}

function loginSuccess (data) {
  return {
    type: LOGIN_SUCCESS_USER,
    data,
  }
}

function loginError (data) {
  return {
    type: LOGIN_ERROR_USER,
    data,
  }
}

// "Log Out" action creators
function beginLogout () {
  return { type: LOGOUT_USER }
}

function logoutSuccess () {
  return { type: LOGOUT_SUCCESS_USER }
}

function logoutError () {
  return { type: LOGOUT_ERROR_USER }
}

// "Register" action creators
function beginRegister () {
  return { type: REGISTER_USER }
}

function registerSuccess () {
  return { type: REGISTER_SUCCESS_USER }
}

function registerError (data) {
  return { type: REGISTER_ERROR_USER, data }
}

function setUser (data) {
  return { type: SET_USER, data }
}

export function manualLogin (
  data,
  successPath // path to redirect to upon successful log in
) {
  return dispatch => {
    dispatch(beginLogin())
    return callApi('auth/login', 'post', data)
      .then(response => {
        if (response.success) {
          localStorage.setItem('logToken', response.token)
          response.user.role == 'admin' ? localStorage.setItem('role', response.user.role) : null
          dispatch(loginSuccess(response))
          addSuccess({ text: 'Logged In Successfully' })
          if (successPath === '/user/signin' || successPath === '/user/signout') { successPath = '/' }
          // browserHistory.push(successPath)
        } else {
          dispatch(loginError(response))
          let loginMessage = response.message
          addError({ text: response.message })
          return loginMessage
        }
      })
      .catch(function (response) {
			    if (response instanceof Error) {
				  console.log('Error', response.message)
			    }
		    })
  }
}

export function manualRegister (data, successPath) {
  return dispatch => {
    dispatch(beginRegister())
    return callApi('auth/register', 'post', data)
      .then(response => {
        if (response.success) {
          dispatch(registerSuccess())
          addSuccess({ text: response.message })
          dispatch(manualLogin(data, successPath))
        } else {
          dispatch(registerError(response))
          addError({ text: response.message })
          let registerMessage = response.message
          return registerMessage
        }
      })
      .catch(response => {
			    if (response instanceof Error) {
			      console.log('Error', response.message)
			    }
		   })
  }

}

export function getCurrentUserData () {
  return dispatch => {
    dispatch(beginLogin())
    return callApi('auth/user', 'get')
      .then(response => {
        if (response.success) { dispatch(setUser(response)) } else { addError({ text: response.message }) }
      })
      .catch(function (response) {
        if (response instanceof Error) { console.log('Error', response.message) }
      })
  }
}

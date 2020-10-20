import {
  MANUAL_LOGIN_USER,
  LOGIN_SUCCESS_USER,
  LOGIN_ERROR_USER,
  LOGOUT_USER,
  LOGOUT_SUCCESS_USER,
  LOGOUT_ERROR_USER,
  REGISTER_USER,
  REGISTER_SUCCESS_USER,
  REGISTER_ERROR_USER,
  SET_USER,
} from '../actions/user-actions'

// Initial State
export const initialState = {
  isWaiting: false,
  authenticated: false,
  email: '',
  name: '',
  message: '',
  loginStatus: false,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case MANUAL_LOGIN_USER:
      return Object.assign({}, state, { isWaiting: true })
    case LOGIN_SUCCESS_USER:
      return Object.assign({}, state, {
        isWaiting: false,
        authenticated: true,
        email: action.data.user.email,
        message: action.data.message,
      })
    case LOGIN_ERROR_USER:
      return Object.assign({}, state, { isWaiting: false, message: action.data.message, errors: action.data.errors })
    case LOGOUT_USER:
      return Object.assign({}, state, { isWaiting: true })
    case LOGOUT_SUCCESS_USER:
      return Object.assign({}, state, { isWaiting: false, authenticated: false, email: '' })
    case LOGOUT_ERROR_USER:
      return Object.assign({}, state, { isWaiting: false, authenticated: true })
    case REGISTER_USER:
      return Object.assign({}, state, { isWaiting: true })
    case REGISTER_SUCCESS_USER:
      return Object.assign({}, state, { isWaiting: false })
    case REGISTER_ERROR_USER:
      return Object.assign({}, state, { isWaiting: false, message: action.data.message, errors: action.data.errors })
    case SET_USER:
      return Object.assign({}, state, { isWaiting: false, ...action.data })
    default:
      return state
  }
}

export default userReducer

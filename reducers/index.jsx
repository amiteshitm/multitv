import { combineReducers } from 'redux'

import { reducer as formReducer } from 'redux-form'
import { flashMessage } from 'redux-flash-messages'

export const initialState = {}

export default combineReducers({
  form: formReducer,
  flashMessage,
})

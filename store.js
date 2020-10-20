import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

import user from 'reducers/user-reducer'
import software from 'reducers/software-reducer'

import { reducer as formReducer } from 'redux-form'
import { flashMessage } from 'redux-flash-messages'

export const initialState = {
  user: user.initialState,
  software: software.initialState,
}

export const reducer = combineReducers({
  user,
  software,
  form: formReducer,
  flashMessage,
})

export function initializeStore (initialState) {
  const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 })

  return createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunkMiddleware)))
}

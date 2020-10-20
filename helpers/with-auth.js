// utils/withAuth.js - a HOC for protected pages
import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import Auth from './Auth'
import {getCurrentUserData} from '../actions/user-actions'
export default function withAuth(AuthComponent) {
   return class Authenticated extends Component {
      constructor(props) {
         super(props)
         this.state = {
            isLoading: true
         };
      }

      componentDidMount () {
         if (!Auth.isLoggedIn()) {
            browserHistory.replace('/user/signin')
         }
         this.props.dispatch(getCurrentUserData())
         this.setState({ isLoading: false })
      }

      render() {
         return (
            <div>
            {this.state.isLoading ? (
               <div>LOADING....</div>
            ) : (
               <AuthComponent {...this.props}  auth={Auth} />
            )}
            </div>
         )
      }
   }
}
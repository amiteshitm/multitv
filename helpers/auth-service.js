const ExecutionEnvironment = require('exenv')

class AuthService {
  constructor (domain) {
    this.fetch = this.fetch.bind(this)
    this.login = this.login.bind(this)
  }

  login (email, password) {
    // Get a token
    return callApi('auth/login', 'post', { email, password }).then(res => {
      this.setToken(res.id_token)
      /*
         return this.fetch(`${this.domain}/user`, {
            method: 'GET'
         })
         */
    })
    /* .then(res => {
        this.setProfile(res)
        return Promise.resolve(res)
      }) */
  }

  loggedIn () {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token // handwaiving here
  }

  setProfile (profile) {
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
  }

  getProfile () {
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setToken (idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken () {
    // Retrieves the user token from localStorage
    return ExecutionEnvironment.canUseDOM ? localStorage.getItem('id_token') : null
  }

  logout () {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
  }

  _checkStatus (response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      let error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }
}
export default AuthService

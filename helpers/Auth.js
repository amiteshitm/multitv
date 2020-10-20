const ExecutionEnvironment = require('exenv');

class Auth{
   static isLoggedIn(){
      return ExecutionEnvironment.canUseDOM
         ? !!localStorage.getItem('logToken')
         : false
   }

   static logout(){
      return ExecutionEnvironment.canUseDOM
         ? localStorage.clear()
         : false
   }

   static getToken() {
      return ExecutionEnvironment.canUseDOM
         ? localStorage.getItem('logToken')
         : null
   }
   static login(token) {
      return ExecutionEnvironment.canUseDOM
         ? localStorage.setItem('logToken',token)
         : null
   }
   static setRole(role){
      return ExecutionEnvironment.canUseDOM
         ? localStorage.setItem('role',role)
         : null
   }
   static isAdmin(){
      return ExecutionEnvironment.canUseDOM
         ? localStorage.getItem('role') == "admin"
         : false
   }
}
export default Auth
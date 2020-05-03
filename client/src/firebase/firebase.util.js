import Axios from 'axios'

export const SigninWithEmail = (email, password) => {
  return Axios({
    method: 'post',
    url: '/api/user/login',
    headers: { 'content-type': 'application/json' },
    data: { email, password }
  })
}

export const SignupWithEmail = (name, email, password) => {
  return Axios({
    method: 'post',
    url: '/api/user/register',
    headers: { 'content-type': 'application/json' },
    data: { name, email, password }
  })
}

export const SignInWithGoogle = (name, email, gwt) => {
  return Axios({
    method: 'post',
    url: '/api/user/googleRegister',
    headers: { 'content-type': 'application/json' },
    data: { name, email, gwt }
  })
}

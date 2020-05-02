import React, { Component } from 'react'
import './signinpage.style.scss'
import SignIn from '../../components/signin/signin.component'
import SignUp from '../../components/signup/signup.component'

export default class SigninPage extends Component {
  render () {
    return (
      <div className='signin-page d-flex flex-column flex-md-row align-items-md-start container'>
        <SignIn className='col-12 col-md-6' />
      </div>
    )
  }
}

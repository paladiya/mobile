import React from 'react'
import './signup.style.scss'
import {
  auth,
  createUserProfileDocument,
  SignupWithEmail
} from '../../firebase/firebase.util'
import { setCurrentUser } from '../../redux/user/user-action'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Message from '../message'

import Signup from '../../assets/img/signup.jpg'
import Logo from '../../assets/img/logo.png'
import ParentLoading from '../parentLoading'
class SignUp extends React.Component {
  constructor (prop) {
    super(prop)
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      loading: false
    }
  }

  handleSubmit = async event => {
    event.preventDefault()

    const { name, email, password, confirmPassword } = this.state

    // if (password !== confirmPassword) {
    //   this.setState({ error: 'Confirm password not match' })
    //   return
    // }

    try {
      await this.setState({ loading: true })
      const result = await SignupWithEmail(name, email, password)
     
      if (result.data.status == 200) {
        this.props.setCurrentUser({
          name,
          email,
          jwt: result.headers.authentication
        })
        this.props.history.replace('/')
      } else {
        this.setState({ error: result.data.title })
      }
      this.setState({ email: '', password: '', name: '', confirmPassword: '' })
    } catch (error) {
      console.log(`sign up error ${error}`)
    }
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  render () {
    return (
      <div className='signup'>
        {this.state.loading && <ParentLoading />}
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-sm-6 login-section-wrapper'>
              <div className='brand-wrapper'>
                <img src={Logo} alt='logo' className='logo' />
              </div>
              <div className='login-wrapper my-auto'>
                <h1 className='login-title'>Sign up</h1>
                <form onSubmit={this.handleSubmit}>
                  <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      className='form-control'
                      placeholder='Enter your name'
                      value={this.state.name}
                      onChange={this.handleChange}
                      required
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                      type='email'
                      name='email'
                      id='email'
                      className='form-control'
                      placeholder='email@example.com'
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className='form-group mb-4'>
                    <label htmlFor='password'>Password</label>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      className='form-control'
                      placeholder='enter your passsword'
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <input
                    name='login'
                    id='login'
                    className='btn btn-block login-btn'
                    type='submit'
                    value='Sign up'
                  />
                </form>
                {this.state.error && (
                  <Message success={false} message={this.state.error} />
                )}
                <p className='login-wrapper-footer-text'>
                  Have an account?{' '}
                  <button
                    onClick={() => this.props.history.replace('/signin')}
                    className='btn btn-link'
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
            <div className='col-sm-6 px-0 d-none d-sm-block'>
              <img src={Signup} alt='Signup image' class='login-img' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProsps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default withRouter(connect(null, mapDispatchToProsps)(SignUp))

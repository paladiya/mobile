import React from 'react'
import './signin.style.scss'
import { SignInWithGoogle, SigninWithEmail } from '../../firebase/firebase.util'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setCurrentUser } from '../../redux/user/user-action'
import Message from '../message'
import Login from '../../assets/img/login.webp'
import Logo from '../../assets/img/logo.png'
import CloseSvg from '../../assets/svg/close.svg'
import { Helmet } from 'react-helmet'

class SignIn extends React.Component {
  constructor (prop) {
    super(prop)
    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false,
      loadingGoogle: false
    }
  }

  handleSubmit = async event => {
    console.log('handle signin')
    event.preventDefault()
    const { email, password } = this.state
    try {
      await this.setState({ loading: true })
      // await new Promise(resolve => {
      //   setTimeout(resolve, 2000)
      // })
      const result = await SigninWithEmail(email, password)
      console.log(result.headers)
      console.log(result)

      await this.setState({ loading: false })

      if (result.data.status == 200) {
        this.props.setCurrentUser({
          name: result.data.name,
          email: result.data.email,
          jwt: result.headers.authentication
        })
        this.props.history.replace('/')
      } else if (result.data.status == 403) {
        this.setState({ error: result.data.title })
      }
    } catch (error) {
      this.setState({ error: error.message })
    }
  }

  handleChange = event => {
    const { value, name } = event.target
    this.setState({ [name]: value })
  }

  responseGoogle = async googleUser => {
    console.log(googleUser)
    this.setState({ loadingGoogle: true })
    let profile = googleUser.getBasicProfile()
    // console.log('Token || ' + googleUser.getAuthResponse().id_token)
    // console.log('ID: ' + profile.getId())
    // console.log('Name: ' + profile.getName())
    // console.log('Image URL: ' + profile.getImageUrl())
    // console.log('Email: ' + profile.getEmail())

    const name = profile.getName()
    const email = profile.getEmail()
    const gwt = googleUser.getAuthResponse().id_token

    if (name != '' && email != '' && gwt != '') {
      try {
        const result = await SignInWithGoogle(name, email, gwt)
        this.setState({ loadingGoogle: false })

        if (result.data.status == 200) {
          this.props.setCurrentUser({
            name: name,
            email: email,
            jwt: result.headers.authentication
          })
          this.props.history.push('/')
        } else if (result.data.status == 403) {
          this.setState({ error: result.data.title,loading:false })
        }
      } catch (error) {
        this.setState({ error: error.message,loading:false })
      }
    } else {
      this.setState({ error: 'Something went wrong with Google try with us ', loading:false })
    }
  }

  render () {
    return (
      <div className='d-flex align-items-center min-vh-100 py-3 py-md-0'>
            <Helmet>
            <title>Signin</title>
            <meta
              name='description'
              content="'Download free Latest Ringtones and HD, mobile,  wallaper  Free on Mobile69.in"
            />
            </Helmet>
        <div className='container'>
          <div className='card login-card'>
            <div className='row no-gutters'>
              <div className='col-md-5'>
                <img src={Login} alt='login' className='login-card-img' />
              </div>
              <div className='close'>
                <img
                  src={CloseSvg}
                  width={25}
                  height={25}
                  onClick={() => this.props.history.replace('/')}
                />
              </div>
              <div className='col-md-7'>
                <div className='card-body'>
                  <div className='brand-wrapper'>
                    <img
                      src={Logo}
                      alt='logo'
                      className='logo'
                      onClick={() => this.props.history.replace('/')}
                    />
                  </div>
                  <p className='login-card-description'>
                    Sign into your account
                  </p>
                  <form onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                      <label htmlFor='email' className='sr-only'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        id='email'
                        className='form-control'
                        placeholder='Email address'
                        value={this.state.email}
                        required
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className='form-group mb-4'>
                      <label htmlFor='password' className='sr-only'>
                        Password
                      </label>
                      <input
                        type='password'
                        name='password'
                        id='password'
                        className='form-control'
                        placeholder='***********'
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <button
                      name='login'
                      id='login'
                      className='btn btn-block login-btn mb-4'
                      type='submit'
                      value='Login'
                    >
                      {' '}
                      {!this.state.loading ? (
                        'Login'
                      ) : (
                        <div>
                          <span
                            class='spinner-border spinner-border-sm'
                            role='status'
                            aria-hidden='true'
                          ></span>{' '}
                          Loading...
                        </div>
                      )}
                    </button>
                  </form>

                  {this.state.error && (
                    <Message success={false} message={this.state.error} />
                  )}

                  {/* <a href='#!' className='forgot-password-link'>
                    Forgot password?
                  </a> */}
                  <p className='login-card-footer-text'>
                    Don't have an account?{' '}
                    <button
                      onClick={() => this.props.history.replace('/signup')}
                      className='btn btn-link'
                    >
                      Register here
                    </button>
                  </p>
                  {/* <nav className='login-card-footer-nav'>
                    <a href='#!'>Terms of use.</a>
                    <a href='#!'>Privacy policy</a>
                  </nav> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProsp = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default withRouter(connect(null, mapDispatchToProsp)(SignIn))

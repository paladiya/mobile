import React, { Component } from 'react'
import './slider.style.scss'
import { connect } from 'react-redux'
import { toggleSlider } from '../../redux/slider/slide-action'
import { doLogout } from '../../redux/user/user-action'
import { withRouter, NavLink } from 'react-router-dom'
import CloseSvg from '../../assets/svg/close.svg'
class SliderComponent extends Component {
  handleSignin = () => {
    this.props.currentUser && this.props.doLogout()
    this.props.history.push('/signin')
    this.props.toggleSlider()
  }

  handleFileUpload = () => {
    if (this.props.currentUser) {
      this.props.history.push('/fileupload')
    } else {
      this.props.history.push('/signin')
    }
    this.props.toggleSlider()
  }

  handleClickCategory = cat => {
    this.props.setCategory(cat)
    this.props.toggleSlider()
    this.props.history.push('/')
  }

  render () {
    return (
      <div className='slider'>
        <div className='content text-left col-md-3 col-sm-12 '>
          <img
            src={CloseSvg}
            width={50}
            height={50}
            className='text-white py-2 align-self-start '
            onClick={() => this.props.toggleSlider()}
          />

          <h5 className='text-muted  '>Content</h5>
          <div className='d-flex flex-column category'>
            <NavLink
              to='/ringtones-and-wallpapers'
              activeClassName='con-item text-left text-primary'
              className='con-item text-left text-white'
            >
              All
            </NavLink>
            <NavLink
              to='/wallpapers'
              activeClassName='con-item text-left text-primary'
              className='con-item text-left text-white'
            >
              Wallpaper
            </NavLink>
            <NavLink
              to='/ringtones'
              activeClassName='con-item text-left text-primary'
              className='con-item text-left text-white'
            >
              Ringtone
            </NavLink>
          </div>
          <h5 className='text-muted py-2'>Share Your Content</h5>
          <div className='d-flex flex-column justify-content-left'>
            <button
              type='button'
              className='btn btn-primary'
              onClick={this.handleFileUpload}
            >
              Upload
            </button>
          </div>
          <button
            type='button'
            onClick={this.handleSignin}
            className='btn btn-outline-danger my-4'
          >
            {this.props.currentUser ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProsps = state => ({
  currentUser: state.user.currentUser
})

const mapDispatchToProps = dispatch => ({
  doLogout: () => dispatch(doLogout()),
  toggleSlider: () => dispatch(toggleSlider())
})

export default withRouter(
  connect(mapStateToProsps, mapDispatchToProps)(SliderComponent)
)

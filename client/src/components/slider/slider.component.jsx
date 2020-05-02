import React, { Component } from 'react'
import './slider.style.scss'
import { connect } from 'react-redux'
import { toggleSlider } from '../../redux/slider/slide-action'
import {  withRouter } from 'react-router-dom'
import { doLogout } from '../../redux/user/user-action'
import { setCategory } from '../../redux/category/cat-action'

class SliderComponent extends Component {
  constructor (props) {
    super(props)
  }

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
          <i
            className='fa fa-close fa-2x text-white py-3 text-left'
            onClick={() => this.props.toggleSlider()}
          />

          <h5 className='text-muted  '>Content</h5>
          <div className='d-flex flex-column category'>
            <div
              className='con-item text-left text-white'
              onClick={() => this.handleClickCategory('all')}
            >
              Home
            </div>
            <div
              className='con-item text-left text-white'
              onClick={() => this.handleClickCategory('wallpaper')}
            >
              Wallpapers
            </div>
            <div
              className='con-item text-left text-white'
              onClick={() => this.handleClickCategory('ringtones')}
            >
              Ringtones
            </div>
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
  toggleSlider: () => dispatch(toggleSlider()),
  setCategory: cat => dispatch(setCategory(cat))
})

export default withRouter(
  connect(mapStateToProsps, mapDispatchToProps)(SliderComponent)
)

import React, { Component } from 'react'
import './navigation.style.css'
import { withRouter, Link, Route, Switch, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { setCategory } from '../../redux/category/cat-action'
import RingtonesWallpaper from '../directory/RingtonesWallpaper'
import Ringtones from '../directory/Ringtones'
import Wallpaper from '../directory/Wallpaper'

class NavigationComponent extends Component {
  constructor (props) {
    super(props)
    this.state = { activeIndex: 0 }
  }

  handleClick = (index, name) => {
    console.log(index)
    this.setState({ activeIndex: index })
    this.props.setCategory(name.toLowerCase())
    this.props.history.replace(`/cat/${name.toLowerCase()}`)
  }

  render () {
    console.log('navigation', this.props)
    return (
      <div className='navigation'>
        <div className='d-flex flex-row justify-content-center mt-0 pt-0'>
          {/* <MyClickable
            name='All'
            index={0}
            onClick={this.handleClick}
            category='ringtones-wallpaper'
          />
          <MyClickable
            name='Wallpaper'
            index={1}
            onClick={this.handleClick}
            category='wallpapers'
          />
          <MyClickable
            name='Ringtones'
            index={2}
            onClick={this.handleClick}
            category='ringtones'
          /> */}

          <NavLink
            to='/ringtones-and-wallpapers'
            activeClassName='btn btn-dark active tab'
            className='btn btn-secondary tab'
          >
            All
          </NavLink>
          <NavLink
            to='/wallpapers'
            activeClassName='btn btn-dark active tab'
            className='btn btn-secondary tab'
          >
            Wallpaper
          </NavLink>
          <NavLink
            to='/ringtones'
            activeClassName='btn btn-dark active tab'
            className='btn btn-secondary tab'
          >
            Ringtone
          </NavLink>
        </div>
        <hr className='divider' />
      </div>
    )
  }
}

export const MyClickable = param => {
  const handleClick = () => param.onClick(param.index, param.name)

  return (
    <div
      className={
        param.category === param.category
          ? 'btn btn-primary active tab '
          : 'btn btn-secondary tab'
      }
      onClick={handleClick}
    >
      <div className='text'>{param.name}</div>
    </div>
  )
}

const mapStateToProps = state => ({
  isToggle: state.slider.isToggle
})

const mapDispatchToProps = dispatch => ({
  setCategory: cat => dispatch(setCategory(cat))
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationComponent)
)

import React, { Component } from 'react'
import LOGO from '../../assets/img/logo.png'
import './header.style.scss'
import { toggleSlider } from '../../redux/slider/slide-action'
import SliderComponent from '../../components/slider/slider.component'
import { Link, withRouter, Redirect } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { selectSearchTerm } from '../../redux/search/search-selector'
import { selectIsToggle } from '../../redux/slider/slide-selector'
import { doSearch } from '../../redux/search/search-action'
import { setCategory } from '../../redux/category/cat-action'
import { connect } from 'react-redux'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: ''
    }
  }

  handleKeyPress = e => {
    console.log(this.props.history)
    console.log('path', this.state.searchTerm)
    if (e.key === 'Enter') {
      if (this.state.searchTerm.trim()) {
        this.props.history.push(`/find/${this.state.searchTerm}`)
      } else {
        this.props.history.replace(`/`)
      }
    }
  }

  handleInputChange = e => {
    console.log(e.target.value)
    this.setState({ searchTerm: e.target.value.trim() })
    if (e.target.value.trim() !== '') {
      this.props.doSearch(e.target.value)
    } else {
      this.props.doSearch('')
      this.props.setCategory('all')
    }
  }

  render () {
    return (
      <div id='header'>
        <div className='row header-parent'>
          <div
            className='col-md-2 menu'
            onClick={() => this.props.setCategory('all')}
          >
            <Link to='/'>
              <img src={LOGO} alt='logo' className='logo' />
            </Link>
          </div>
          <div className='input-group col-md-7 menu'>
            <div className='input-group-prepend'>
              <span className='input-group-text form-control' id='basic-addon1'>
                <i className='fa fa-search' />
              </span>
            </div>
            <input
              type='text'
              placeholder='Search Wallpaper and Ringtones'
              className='search form-control'
              onKeyPress={this.handleKeyPress}
              onChange={this.handleInputChange}
              value={this.state.searchTerm}
            />
          </div>
          <div
            className='col-md-2 menu '
            onClick={() => this.props.toggleSlider()}
          >
            <i className='fa fa-bars fa-2x' />
          </div>
        </div>
        <hr className='divider' />
        {this.props.isToggle && <SliderComponent />}
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isToggle: selectIsToggle
})

const mapDispatchToProps = dispatch => ({
  toggleSlider: () => dispatch(toggleSlider()),
  doSearch: term => dispatch(doSearch(term)),
  setCategory: cat => dispatch(setCategory(cat))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

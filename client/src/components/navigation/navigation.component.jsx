import React, { Component } from 'react'
import './navigation.style.css'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setCategory } from '../../redux/category/cat-action'
import DirectoryComponent from '../../components/directory/directory.component'
import { Route } from 'react-router-dom'

class NavigationComponent extends Component {
  constructor (props) {
    super(props)
    this.state = { activeIndex: 0 }
  }

  handleClick = (index, name) => {
    console.log(index)
    this.setState({ activeIndex: index })
    this.props.setCategory(name.toLowerCase())
    this.props.history.push(`/cat/${name.toLowerCase()}`)
  }

  render () {
    console.log(this.props.match)
    return (
      <div className='navigation'>
        <div className='d-flex flex-row justify-content-center mt-0 pt-0'>
          <MyClickable
            name='All'
            index={0}
            onClick={this.handleClick}
            category={this.props.cat}
          />
          <MyClickable
            name='Wallpaper'
            index={1}
            onClick={this.handleClick}
            category={this.props.cat}
          />
          <MyClickable
            name='Ringtones'
            index={2}
            onClick={this.handleClick}
            category={this.props.cat}
          />
        </div>
        <hr className='divider' />
        <DirectoryComponent />
      </div>
    )
  }
}

export const MyClickable = param => {
  const handleClick = () => param.onClick(param.index, param.name)

  return (
    <div
      className={
        param.name.toLowerCase() == param.category
          ? 'btn btn-primary active tab'
          : 'btn btn-secondary tab'
      }
      onClick={handleClick}
    >
      <div className='text'>{param.name.toUpperCase()}</div>
    </div>
  )
}

const mapStateToProps = state => ({
  isToggle: state.slider.isToggle,
  cat: state.category.cat
})

const mapDispatchToProps = dispatch => ({
  setCategory: cat => dispatch(setCategory(cat))
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationComponent)
)

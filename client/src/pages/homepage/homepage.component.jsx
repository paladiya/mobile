import React, { Component } from 'react'
import './homepage.style.scss'
import NavigationComponent from '../../components/navigation/navigation.component'
import HeaderComponent from '../../components/header/header.component'
import { connect } from 'react-redux'
import { setCategory } from '../../redux/category/cat-action'
import { Helmet } from 'react-helmet'

class HomepageComponent extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // this.props.history.push(`/${this.props.cat}`)
  }

  render () {
    return (
      <div className='homepage '>
        <Helmet>
          <title>Latest Ringtones and HD wallaper</title>
          <meta
            name='description'
            content='Download Latest Ringtones and HD, mobile,  wallaper  Free on Mobile69.'
          />
        </Helmet>
        <HeaderComponent />
        <NavigationComponent />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isToggle: state.slider.isToggle,
  cat: state.category.cat
})

const mapDispatchToProps = dispatch => ({
  setCategory: cat => dispatch(setCategory(cat))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomepageComponent)

import React, { Component } from 'react'
import './style.scss'
import { Link } from 'react-router-dom'

export default class Page404 extends Component {
  render () {
    return (
      <div id='notfound'>
        <div className='notfound'>
          <div className='notfound-404'>
            <h1>Oops!</h1>
          </div>
          <h2>{this.props.title || '404 - Page not found'}</h2>
          <h5>
          {this.props.description || 'The page you are looking for might have been removed had its name changed or is temporarily unavailable.'}
          </h5>
          <Link to='/'>Go To Homepage</Link>
        </div>
      </div>
    )
  }
}

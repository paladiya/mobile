import React, { Component } from 'react'
import './style.scss'
export class Loading extends Component {
  render () {
    return (
      <div className='loader-container'>
        <div className='loader'></div>
      </div>
    )
  }
}

export default Loading

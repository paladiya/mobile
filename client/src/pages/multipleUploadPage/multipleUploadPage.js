import React, { Component } from 'react'
import MultipleUpload from '../../components/multipleUpload'
import UserGallery from '../../components/userGallery'

export default class MultipleUploadPage extends Component {
  triggerUpdate = () => {
    this.gallary.update()
  }

  render () {
    return (
      <div>
        <MultipleUpload onUpdate={this.triggerUpdate.bind(this)} />
        <UserGallery ref={gallary => (this.gallary = gallary)} />
      </div>
    )
  }
}

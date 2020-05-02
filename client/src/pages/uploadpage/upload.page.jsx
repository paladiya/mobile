import React, { Component } from 'react'
import FileuploadComponent from '../../components/file-upload/fileupload.component'
import UserGallery from '../../components/userGallery'

export default class UploadPage extends Component {
  triggerUpdate = () => {
    this.gallary.update()
  }

  render () {
    return (
      <div>
        <FileuploadComponent onUpdate={this.triggerUpdate.bind(this)} />
        <UserGallery ref={gallary => (this.gallary = gallary)} />
      </div>
    )
  }
}

import React, { Fragment, useState, Component } from 'react'
import axios from 'axios'
import Message from '../message'
import Progress from '../progress/progress.component'
import { connect } from 'react-redux'
import './fileupload.style.scss'
import Header from '../header/header.component'
import { Redirect, withRouter } from 'react-router'
import { all } from '../../data'

class FileuploadComponent extends Component {
  constructor (props) {
    super(props)
    this.messageRef = React.createRef()
    this.state = {
      files: [],
      file: '',
      filename: 'Choose File',
      fileOriginName: '',
      filepath: '',
      message: '',
      progress: 0,
      success: Boolean,
      url: '',
      tags: [],
      loading: false,
      upload: []
    }
    this.videoExt = []
    this.imageExt = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'ico']
    this.musicExt = ['wav', 'mp3', 'aac', 'ogg']
  }

  readURL = file => {
    return new Promise((res, rej) => {
      const reader = new FileReader()
      reader.onload = e => res(e.target.result)
      reader.onerror = e => rej(e)
      reader.readAsDataURL(file)
    })
  }

  onChageInput = async e => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    const fileSize = file.size / (1024 * 1024)
    console.log(process.env.MAX_FILE_SIZE)
    if (fileSize > process.env.REACT_APP_MAX_FILE_SIZE) {
      this.setState({
        message: `Select max file size ${process.env.REACT_APP_MAX_FILE_SIZE} MB`
      })
      this.setState({ success: false })
      return
    }
    // if(file.)

    let fileType = file.name.split('.').pop()
    if (this.imageExt.includes(fileType)) {
      fileType = 'image'
    } else if (this.videoExt.includes(fileType)) {
      fileType = 'video'
    } else if (this.musicExt.includes(fileType)) {
      fileType = 'music'
    } else {
      fileType = undefined
      this.setState({ message: 'Select valid media file' })
      this.setState({ success: false })
      return
    }

    const url = await this.readURL(e.target.files[0])
    if (file) {
      this.setState({ loading: false })
      this.setState({ file: file })
      this.setState({ filename: file.name })
      this.setState({ fileOriginName: file.name.split('.')[0] })
      this.setState({ url: url })

      this.setState({
        filepath: '',
        message: '',
        progress: 0,
        success: false,
        tags: []
      })
    }
  }

  onTagKeyPress = e => {
    console.log(e.key)
    if (e.key === 'Enter' || e.key === ' ') {
      let val = e.target.value.trim()
      e.target.value = ''
      val &&
        this.setState(preState => ({
          tags: [...preState.tags, val]
        }))
    }
  }

  removeTag = removeTag => {
    console.log('remove tag')
    this.setState({
      tags: this.state.tags.filter(tag => {
        return tag !== removeTag
      })
    })
  }

  onChangeFileName = e => {
    e.preventDefault()
    console.log(e.target.value)
    this.setState({ fileOriginName: e.target.value })
  }

  onSubmit = async e => {
    e.preventDefault()

    if (this.state.tags.length <= 0) {
      const tag = document.getElementById('inputfilelabel')
      if (tag.value !== '') {
        await this.setState(preState => ({
          tags: [...preState.tags, tag.value]
        }))
      } else {
        this.setState({ message: 'Please enter teg with spacebar' })
        this.setState({ success: false })
        return false
      }
    }

    const formData = new FormData()
    formData.append('file', this.state.file)
    formData.append('fileOriginName', this.state.fileOriginName)
    formData.append('fileTag', this.state.tags)
    formData.append('userName', this.props.currentUser.name)
    this.setState({ loading: true })

    let res
    try {
      res = await axios.post('/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': this.props.currentUser.jwt
        },
        onUploadProgress: ProgressEvent => {
          this.setState({
            progress: parseInt(
              Math.round(ProgressEvent.loaded * 100) / ProgressEvent.total
            )
          })
        }
      })

      this.setState({
        file: '',
        filename: 'Choose File',
        fileOriginName: '',
        filepath: '',
        progress: 0,
        success: Boolean,
        url: '',
        tags: []
        // loading: false
      })
      document.getElementById('inputfilelabel').value = ''

      const { filename, filepath, savedFile } = res.data

      setTimeout(
        () =>
          this.setState({
            message: ''
          }),
        2000
      )

      // this.setState({ filename: filename })
      this.setState({ filepath: filepath })
      this.setState({ message: 'File Uploaded' })
      this.setState({ success: true })
      this.setState({ files: [savedFile, ...this.state.files] })
      this.props.onUpdate()
      console.log(this.state.files)
    } catch (error) {
      console.error(error)

      setTimeout(
        () =>
          this.setState({
            message: ''
          }),
        2000
      )
      this.setState({ success: false })

      if (error.response) {
        if (error.response.status === 500) {
          console.log('server is down')
          this.setState({ message: 'Internal Server Error' })
        } else {
          console.log(error.response.data.message)
          this.setState({ message: error.response.data.message })
        }
      }
      this.setState({ message: error.message })
    }
  }

  render () {
    console.log('progress ', this.state.loading)
    if (!this.props.currentUser) {
      return <Redirect to='/signin' />
    }
    return (
      <div className=' parent-fileupload'>
        <Header />
        {this.state.url ? (
          <div className='row mt-5 align-self-center'>
            <div className='m-auto'>
              <img
                // src={`${process.env.PUBLIC_URL}${this.state.filepath}`}
                src={this.state.url}
                alt={this.state.filename}
                className='col-12 my-3 col-md-6 preview card'
              />
            </div>
          </div>
        ) : null}

        <form className='d-flex flex-column '>
          <div className='custom-file mt-4 form-control form-cntrol-lg'>
            <label className='custom-file-label' htmlFor='validatedCustomFile'>
              {this.state.filename}
            </label>
            <input
              multiple
              type='file'
              className='custom-file-input'
              id='validatedCustomFile'
              onChange={this.onChageInput}
              required
            />
          </div>
          <div className='form-group mt-4'>
            <label htmlFor='inputFileName'>File Name</label>
            <input
              value={this.state.fileOriginName}
              onChange={this.onChangeFileName}
              type='text'
              className='form-control'
              id='inputFileName'
              aria-describedby='Enter File Related Name'
              placeholder='Enter file name'
              required
            />
            <small id='emailHelp' className='form-text text-muted'>
              Enter File Related Name.
            </small>
          </div>
          <div className='form-group'>
            <label htmlFor='inputfilelabel'>File Tags</label>
            <div className='tag-list'>
              {this.state.tags.map((tag, index) => {
                return (
                  <Tag key={index} removeTag={tag => this.removeTag(tag)}>
                    {tag}
                  </Tag>
                )
              })}
            </div>
            <input
              type='text'
              className='form-control'
              id='inputfilelabel'
              aria-describedby='Enter Media Related Tag'
              placeholder='Enter Media Tag'
              onKeyPress={this.onTagKeyPress}
            />
            <small id='emailHelp' className='form-text text-muted'>
              Enter File Related Tag seperate by Spacebar
            </small>

            <div className='cat-parent'>
              {all.map((cat, index) => (
                <div
                  className='badge badge-pill cat'
                  key={index}
                  onClick={() => {
                    this.setState(preState => ({
                      tags: [...preState.tags, cat]
                    }))
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <Progress percentage={this.state.progress} />

          <Message
            ref={this.myRef}
            message={this.state.message}
            success={this.state.success}
          />

          <input
            type='button'
            onClick={this.onSubmit}
            value='Upload'
            className='btn btn-primary m-1 btn-submit'
          />
        </form>
        <hr className='divider mt-5' />
      </div>
    )
  }
}

const Tag = props => {
  return (
    <div
      className='badge badge-pill badge-success tag'
      onClick={() => props.removeTag(props.children)}
    >
      <h6 className='m-auto'>{props.children}</h6>
      <i className='fa fa-times ml-2'></i>
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default withRouter(connect(mapStateToProps, null)(FileuploadComponent))

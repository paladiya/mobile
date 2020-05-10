import React, { Component } from 'react'
import axios from 'axios'
import Message from '../message'
import Progress from '../progress/progress.component'
import { connect } from 'react-redux'
import './style.scss'
import Header from '../header/header.component'
import { withRouter } from 'react-router'
import { all } from '../../data'
import CloseSvg from '../../assets/svg/close.svg'

class MultipleUpload extends Component {
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
      upload: [],
      filetype: ''
    }
    this.videoExt = []
    this.imageExt = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'ico', 'image']
    this.musicExt = ['wav', 'mp3', 'aac', 'ogg', 'audio']
  }

  onChageInput = e => {
    this.setState({ upload: [...Object.values(e.target.files)] }, newState => {
      //   console.log(newState.upload)

      this.state.upload.map(file => {
        console.log('map file ', file)

        const fileSize = file.size / (1024 * 1024)
        if (fileSize > process.env.REACT_APP_MAX_FILE_SIZE) {
          this.setState({
            message: `Select max file size ${process.env.REACT_APP_MAX_FILE_SIZE} MB`,
            success: false,
            upload: []
          })
          return
        }

        let fileType = file.type.split('/')[0]
        console.log('filetype ', file)
        if (this.imageExt.includes(fileType)) {
          fileType = 'image'
        } else if (this.videoExt.includes(fileType)) {
          fileType = 'video'
        } else if (this.musicExt.includes(fileType)) {
          fileType = 'music'
        } else {
          this.setState({
            upload: [],
            message: 'Select valid media file',
            success: false
          })
          return
        }
      })
    })

    if (!this.props.currentUser) {
      this.props.history.replace('/signin')
    }
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

    if (!this.state.fileOriginName) {
      this.setState({ message: 'Please enter FileName' })
      this.setState({ success: false })
      return false
    }

    await this.state.upload.map(async file => {
      new Promise(resolve => {
        this.setState({ progress: 0 }, resolve)
      })
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileOriginName', this.state.fileOriginName)
      console.log(this.state.tags)
      formData.append('fileTag', [...this.state.tags])

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

        const { filename, filepath, savedFile } = res.data
      } catch (error) {
        console.error(error)
        this.setState({ success: false })

        if (error.response.status === 500) {
          console.log('server is down')
          this.setState({ message: 'Internal Server Error' })
        } else {
          console.log(error.response.data.message)
          this.setState({ message: error.response.data.message })
        }
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
      tags: [],
      upload: []
      // loading: false
    })

    setTimeout(
      () =>
        this.setState({
          message: '',
          progress: 0
        }),
      2000
    )
    this.props.onUpdate()
    // this.setState({ filename: filename })
    this.setState({ message: 'File Uploaded' })
    this.setState({ success: true })
  }

  removeTag = removeTag => {
    console.log('remove tag')
    this.setState({
      tags: this.state.tags.filter(tag => {
        return tag !== removeTag
      })
    })
  }

  render () {
    return (
      <div>
        <div className='parent-fileupload'>
          <Header />
          {console.log(this.state.upload)}
          <div className='row pre-parent'>
            {this.state.upload.length > 0 &&
              this.state.upload.map((file, index) => {
                return (
                  <div className='col-3 col-md-3' key={index}>
                    <img
                      // src={`${process.env.PUBLIC_URL}${this.state.filepath}`}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className='preview card'
                    />
                  </div>
                )
              })}
          </div>
        </div>

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
                    this.setState({ tags: [...this.state.tags, cat] })
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
      <img className='ml-2' src={CloseSvg} width={20} height={20} />
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default withRouter(connect(mapStateToProps, null)(MultipleUpload))

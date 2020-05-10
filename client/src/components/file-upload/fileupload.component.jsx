import React, { Component, Fragment } from 'react'
import './fileupload.style.scss'
import axios from 'axios'
import Message from '../message'
import Progress from '../progress/progress.component'
import { connect } from 'react-redux'
import Header from '../header/header.component'
import { Redirect, withRouter } from 'react-router'
import { all } from '../../data'
import { encode } from '../MusicTrimmer.js/worker-client'
import { sliceAudioBuffer } from '../MusicTrimmer.js/audio-helper'
import {
  isAudio,
  readBlobURL,
  download,
  rename
} from '../MusicTrimmer.js/utils'
import ParentLoading from '../parentLoading'
import CloseSvg from '../../assets/svg/close.svg'

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
      upload: [],
      filetype: '',
      isPlay: false
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

  initMusic = file => {
    if (this.wavesurfer) {
      this.wavesurfer.destroy()
    }
    this.wavesurfer = window.WaveSurfer.create({
      container: '#waveform',
      waveColor: '#D9DCFF',
      progressColor: '#4353FF',
      cursorColor: '#4353FF',
      cursorWidth: 5,
      barWidth: 1,
      barRadius: 3,
      height: 80,
      barGap: 3,
      scrollParent: true,
      plugins: [
        window.WaveSurfer.regions.create({
          regions: []
        })
      ]
    })
    this.wavesurfer.on('ready', () => {
      this.wavesurfer.play.bind(this.wavesurfer)
      this.wavesurfer.addRegion({
        id: 'main',
        start: 0,
        end: this.wavesurfer.getDuration(),
        loop: true,
        color: 'hsla(100, 100%, 30%, 0.5)',
        handleStyle: {
          left: {
            background:
              'url(https://web-assets.zobj.net/web/53e81d1926/assets/handle.svg) no-repeat',

            cursor: 'col-resize',
            position: 'absolute',
            top: '0px',
            maxWidth: '100px',
            minWidth: '10px',
            left: '0px'
          },
          right: {
            background:
              'url(https://web-assets.zobj.net/web/53e81d1926/assets/handle.svg) no-repeat',

            cursor: 'col-resize',
            position: 'absolute',
            top: '0px',
            maxWidth: '100px',
            minWidth: '10px',
            right: '0px'
          }
        }
      })
    })
    this.wavesurfer.load(readBlobURL(file))
  }

  onChageInput = async e => {
    console.log(e.target.files[0])
    const file = e.target.files[0]
    if (!file) {
      return
    }
    const fileSize = file.size / (1024 * 1024)
    let fileType = file.name.split('.').pop()
    const url = readBlobURL(file)

    console.log(process.env.MAX_FILE_SIZE)
    if (fileSize > process.env.REACT_APP_MAX_FILE_SIZE) {
      this.setState({
        success: false,
        message: `Select max file size ${process.env.REACT_APP_MAX_FILE_SIZE} MB`
      })

      return
    }

    if (this.imageExt.includes(fileType)) {
      fileType = 'image'
    } else if (this.videoExt.includes(fileType)) {
      fileType = 'video'
    } else if (isAudio(file)) {
      fileType = 'music'
      this.initMusic(file)
    } else {
      fileType = undefined
      this.setState({ message: 'Select valid media file' })
      this.setState({ success: false })
      return
    }

    if (file) {
      this.setState({
        filetype: file.type.split('/')[0],
        loading: false,
        file: file,
        filename: file.name,
        fileOriginName: file.name.split('.')[0],
        url: url,
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

  blobToFile = (theBlob, fileName) => {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date()
    theBlob.name = fileName
    return theBlob
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
    await this.setState({ loading: true })

    if (this.state.filetype === 'audio') {
      await this.handlecut(false)
    }
    console.log('myfile ', this.state.file)

    const formData = new FormData()
    formData.append('file', this.state.file)
    formData.append('fileOriginName', this.state.fileOriginName)
    formData.append('fileTag', this.state.tags)
    formData.append('userName', this.props.currentUser.name)
    this.setState({ loading: true })
    console.log('form data ', JSON.stringify(formData))
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

      this.wavesurfer.empty()
      this.setState({
        file: '',
        filename: 'Choose File',
        fileOriginName: '',
        filepath: '',
        progress: 0,
        success: Boolean,
        url: '',
        tags: [],
        filetype: '',
        loading: false
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

      this.setState({
        filepath: filepath,
        message: 'File Uploaded',
        success: true,
        files: [savedFile, ...this.state.files]
      })
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
      await this.setState({ success: false, loading: false })

      if (error.response.data) {
        if (error.response.status === 500) {
          console.log('server is down')
          this.setState({ message: 'Internal Server Error' })
        } else {
          console.log(error.response.data.message)
          if (error.response.data.message) {
            this.setState({ message: error.response.data.message })
          }
        }
      }
      this.setState({ message: error.message })
    }
  }

  handlePlayPause = () => {
    if (this.state.isPlay) {
      this.setState({ isPlay: false }, newState => {
        this.wavesurfer.pause()
      })
    } else {
      this.setState({ isPlay: true }, newState => {
        this.wavesurfer.play()
      })
    }
  }
  componentDidMount () {}

  handlecut = async isDownload => {
    this.setState({ loading: true })

    const audioSliced = sliceAudioBuffer(
      this.wavesurfer.backend.buffer,
      ~~(
        (this.wavesurfer.backend.buffer.length *
          this.wavesurfer.regions.list['main'].start) /
        this.wavesurfer.backend.getDuration()
      ),
      ~~(
        (this.wavesurfer.backend.buffer.length *
          this.wavesurfer.regions.list['main'].end) /
        this.wavesurfer.backend.getDuration()
      )
    )

    await encode(audioSliced, 'mp3')
      .then(async file => {
        var url = URL.createObjectURL(file)
        console.log('url ', url)
        this.setState({ url: url })
        // var myFile = this.blobToFile(file, `${this.state.file.name}.mp3`)
        var myFile = await new File([file], `${this.state.file.name}.mp3`, {
          lastModified: new Date().now
        })

        this.setState({ file: myFile }, newState => {
          if (isDownload) {
            this.setState({ loading: false })
            download(url, rename(this.state.file.name, 'mp3'))
          }
        })
      })
      .catch(e => console.error(e))
      .then(() => {
        console.log('processsing finish ')
        this.setState({ loading: false })
      })
  }

  render () {
    console.log('progress ', this.state.filetype)

    if (!this.props.currentUser) {
      return <Redirect to='/signin' />
    }
    return (
      <div className='parent-fileupload'>
        {this.state.loading && <ParentLoading />}
        <Header />
        <div className={this.state.filetype === 'audio' ? 'd-block' : 'd-none'}>
          <div id='waveform' className='wave'></div>
          <div className='d-flex justify-content-center d-'>
            <button
              className='btn btn-primary m-1 btn-submit'
              onClick={this.handlePlayPause}
            >
              {this.state.isPlay ? 'Pause' : 'Play'}
            </button>
            <button
              className='btn btn-primary m-1 btn-submit'
              onClick={() => this.handlecut(true)}
            >
              Download
            </button>
          </div>
        </div>

        {this.state.filetype === 'image' && (
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
        )}

        {/* <button onClick={}></button> */}
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
            ref={this.messageref}
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
      <img src={CloseSvg} className='ml-2' width={20} height={20} />
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})

export default withRouter(connect(mapStateToProps, null)(FileuploadComponent))

import React, { Component } from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import PlayImg from '../../assets/img/play.png'
import PauseImg from '../../assets/img/pause.png'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { selectIsPlaying, selectItemId } from '../../redux/play/play-selector'
import { play, pause } from '../../redux/play/play-action'
import { selectCurretnUser } from '../../redux/user/user-selector'
import Axios from 'axios'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import Img from 'react-image'
import MusicSpinner from '../Util/MusicSpinner'
import TrianglifyGenerate from '../Util/Trianglify'
import CloseSvg from '../../assets/svg/close.svg'

class MusicItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      audioPercent: 0,
      loading: false,
      imgLoading: false
    }
  }

  componentWillUnmount () {
    this.props.dispatch(pause(this.props.playId))
  }

  deleteImage = async id => {
    const result = await Axios.post(
      '/api/post/delete',
      { id: id },
      {
        headers: {
          'auth-token': this.props.currentUser.jwt
        }
      }
    )
    console.log(result)
    if (result.status === 200) {
      return id
    }
    console.log(result)
  }

  onHandleEnded = id => {
    this.props.dispatch(pause(id))
  }
  onPlay = async id => {
    if (document.querySelectorAll('audio').length > 0) {
      for (const audio of document.querySelectorAll('audio')) {
        audio.pause()
      }
    }
    this.setState({ loading: true })
    this.audio.play()
  }

  onHandlePlay = id => {
    console.log('handle play')
    this.setState({ loading: false })
    this.props.dispatch(play(id))
  }

  onPause = id => {
    this.audio.pause()
  }

  onHandlePause = id => {
    this.props.dispatch(pause(id))
  }

  onHandleTimeUpdate = event => {
    var currentTime = this.audio.currentTime
    var duration = this.audio.duration
    var percent = (currentTime * 100) / duration
    this.setState({ audioPercent: percent })
  }

  componentDidMount () {
    if (!this.props.item.pattern) {
      this.setState({
        pattern: TrianglifyGenerate()
          .canvas()
          .toDataURL()
      })
    }
  }

  render () {
    return (
      <div className={`${this.props.col}  list-item align-self-center`}>
        <audio
          preload='auto'
          ref={audio => (this.audio = audio)}
          id='audio'
          src={
            process.env.PUBLIC_URL + '/api/music/' + this.props.item.fileName
          }
          onEnded={() => this.onHandleEnded(this.props.item._id)}
          onPlay={() => this.onHandlePlay(this.props.item._id)}
          onPause={() => this.onHandlePause(this.props.item._id)}
          onTimeUpdate={this.onHandleTimeUpdate}
        />

        <div className='card d-flex justify-content-center align-items flex-column'>
          <Img
            id='trianglify'
            className='img-cover card-img'
            src={
              this.props.item.pattern
                ? this.props.item.pattern
                : this.state.pattern
            }
            onLoad={() => this.setState({ imgLoading: true })}
          />
          {this.state.imgLoading && this.state.loading ? (
            <div className='parent-media progress'>
              <MusicSpinner className='progress' />
            </div>
          ) : (
            <CircularProgressbar
              className='w-5 h-5 progress'
              value={this.state.audioPercent}
            />
          )}

          <Link
            to={{
              pathname: '/' + this.props.item.types + '/' + this.props.item._id,
              state: { item: this.props.item }
            }}
            onClick={e => !this.props.isActive && e.preventDefault()}
          >
            {this.props.name && (
              <h5 className='card-title'>{this.props.item.fileOriginName}</h5>
            )}
            <div className='card-img-overlay'>
              {this.props.delete && (
                <img
                  className='btn-close'
                  src={CloseSvg}
                  width={25}
                  height={25}
                  onClick={async () => {
                    let deleteId = await this.deleteImage(this.props.item._id)
                    this.props.updateGallery(deleteId)
                  }}
                />
              )}
            </div>
          </Link>

          <div className='card-img-overlay parent-media'>
            {this.props.isPlaying &&
            this.props.playId === this.props.item._id ? (
              <img
                alt='pause'
                src={PauseImg}
                onClick={() => this.onPause(this.props.item._id)}
                className='img-media'
              />
            ) : (
              <img
                alt='play'
                src={PlayImg}
                onClick={() => this.onPlay(this.props.item._id)}
                className='img-media'
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProsp = createStructuredSelector({
  isPlaying: selectIsPlaying,
  playId: selectItemId,
  currentUser: selectCurretnUser
})

export default connect(mapStateToProsp, null)(MusicItem)

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Link } from 'react-router-dom'
import BackImg from '../../assets/img/sunburst.gif'
import PlayImg from '../../assets/img/play.png'
import PauseImg from '../../assets/img/pause.png'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { selectIsPlaying, selectItemId } from '../../redux/play/play-selector'
import { play, pause } from '../../redux/play/play-action'

import MusicPause from '../../assets/img/music.gif'
import MusicPlay from '../../assets/img/sunburst.gif'
import { selectCurretnUser } from '../../redux/user/user-selector'
import Axios from 'axios'

class MusicItem extends Component {
  constructor (props) {
    super(props)
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
    this.audio.play()
  }

  onHandlePlay = id => {
    console.log('handle play')
    this.props.dispatch(play(id))
  }

  onPause = id => {
    this.audio.pause()
  }

  onHandlePause = id => {
    this.props.dispatch(pause(id))
  }

  render () {
    return (
      <div className={`${this.props.col}  list-item align-self-center`}>
        <audio
          ref={audio => (this.audio = audio)}
          id='audio'
          src={
            process.env.PUBLIC_URL + '/api/music/' + this.props.item.fileName
          }
          onEnded={() => this.onHandleEnded(this.props.item._id)}
          onPlay={() => this.onHandlePlay(this.props.item._id)}
          onPause={() => this.onHandlePause(this.props.item._id)}
        />

        <div className='card'>
          <img
            className='img-cover card-img'
            src={
              this.props.isPlaying && this.props.playId == this.props.item._id
                ? MusicPlay
                : MusicPause
            }
          />
          <Link
            to={{
              pathname: '/' + this.props.item.types + '/' + this.props.item._id,
              state: { item: this.props.item }
            }}
            onClick={e => !this.props.isActive && e.preventDefault()}
          >
            {this.props.name && (
              <h5 className='card-title ml-3'>
                {this.props.item.fileOriginName}
              </h5>
            )}
            <div className='card-img-overlay'>
              {this.props.delete && (
                <i
                  onClick={async () => {
                    let deleteId = await this.deleteImage(this.props.item._id)
                    this.props.updateGallery(deleteId)
                  }}
                  className='fa fa-times fa-2x btn-close'
                ></i>
              )}
            </div>
          </Link>

          <div className='card-img-overlay parent-media '>
            {this.props.isPlaying &&
            this.props.playId == this.props.item._id ? (
              <img
                src={PauseImg}
                onClick={() => this.onPause(this.props.item._id)}
                className='img-media'
              />
            ) : (
              <img
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

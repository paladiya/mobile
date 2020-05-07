import '@mohayonao/web-audio-api-shim'
import React, { Component } from 'react'
import './style.scss'

import Player from './player'
// import FilePicker from './file'
import Icon from './icon'
import { isAudio, readBlobURL, download, rename } from './utils'
import { sliceAudioBuffer } from './audio-helper'
import { encode } from './worker-client'
import WebAudio from './webaudio'

import Play from './icons/play.svg'
import Pause from './icons/pause.svg'
import Replay from './icons/replay.svg'
import Spin from './icons/spin.svg'
import Download from './icons/download.svg'

class MusicTrimmer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      file: null,
      decoding: false,
      audioBuffer: null,
      paused: true,
      startTime: 0,
      endTime: Infinity,
      currentTime: 0,
      processing: false
    }

    this.file = this.props.file
  }

  async componentDidMount () {
    if (!isAudio(this.file)) {
      this.props.message('please select valid audio file')
    }

    this.setState({
      file: this.file,
      paused: true,
      decoding: true,
      audioBuffer: null
    })

    const audioBuffer = await WebAudio.decode(this.file)

    window.audioBuffer = audioBuffer

    this.setState({
      paused: false,
      decoding: false,
      audioBuffer,
      startTime: 0,
      currentTime: 0,
      endTime: audioBuffer.duration / 2
    })
  }
  handleFileChange = async file => {}

  handleStartTimeChange = time => {
    this.setState({
      startTime: time
    })
  }

  handleEndTimeChange = time => {
    this.setState({
      endTime: time
    })
  }

  handleCurrentTimeChange = time => {
    this.setState({
      currentTime: time
    })
  }

  handlePlayPauseClick = () => {
    this.setState({
      paused: !this.state.paused
    })
  }

  handleReplayClick = () => {
    console.log(this.state.startTime)
    this.setState({
      currentTime: this.state.startTime
    })
  }

  get startByte () {
    return parseInt(
      (this.audioBuffer.length * this.state.start) /
        this.widthDurationRatio /
        this.duration,
      10
    )
  }

  get endByte () {
    return parseInt(
      (this.audioBuffer.length * this.state.end) /
        this.widthDurationRatio /
        this.duration,
      10
    )
  }

  handleEncode = e => {
    const type = e.currentTarget.dataset.type
    const { startTime, endTime, audioBuffer } = this.state
    const { length, duration } = audioBuffer

    const audioSliced = sliceAudioBuffer(
      audioBuffer,
      ~~((length * startTime) / duration),
      ~~((length * endTime) / duration)
    )

    this.setState({
      processing: true
    })
    console.log('encoding')

    encode(audioSliced, type)
      .then(readBlobURL)
      .then(url => {
        console.log('url ', url)
        // download(url, rename(this.state.file.name, type))
      })
      .catch(e => console.error(e))
      .then(() => {
        console.log('processsing finish ')
        this.setState({
          processing: false
        })
      })
  }

  displaySeconds (seconds) {
    return seconds.toFixed(2) + 's'
  }

  render () {
    const { state } = this
    console.log(this.state.paused)
    console.log(this.state.currentTime)

    return (
      <div className='container'>
        {this.state.audioBuffer || this.state.decoding ? (
          <div>
            {this.state.decoding ? (
              <div className='player player-landing'>DECODING...</div>
            ) : (
              <Player
                audioBuffer={this.state.audioBuffer}
                paused={this.state.paused}
                startTime={this.state.startTime}
                endTime={this.state.endTime}
                currentTime={this.state.currentTime}
                onStartTimeChange={this.handleStartTimeChange}
                onEndTimeChange={this.handleEndTimeChange}
                onCurrentTimeChange={this.handleCurrentTimeChange}
                ref='player'
              />
            )}

            <div className='controllers'>
              {/* <FilePicker onChange={this.handleFileChange}>
                  <div className='ctrl-item' title='重新选择'>
                    <Icon name='music' />
                  </div>
                </FilePicker> */}

              <a
                className='ctrl-item'
                title='play'
                onClick={this.handlePlayPauseClick}
              >
                <img src={this.state.paused ? Pause : Play} />
              </a>

              <a
                className='ctrl-item'
                title='replay'
                onClick={this.handleReplayClick}
              >
                <img src={Replay} />
              </a>

              {/* <div className='dropdown list-wrap'>
                <a className='ctrl-item'>
                  <img src={this.state.processing ? Spin : Download} />
                </a>
                {!this.state.processing && (
                  <ul className='list'>
                    <li>
                      <a onClick={this.handleEncode} data-type='wav'>
                        Wav
                      </a>
                    </li>
                    <li>
                      <a onClick={this.handleEncode} data-type='mp3'>
                        MP3
                      </a>
                    </li>
                  </ul>
                )}
              </div> */}

              {isFinite(this.state.endTime) && (
                <span className='seconds'>
                  Select{' '}
                  <span className='seconds-range'>
                    {this.displaySeconds(state.endTime - state.startTime)}
                  </span>{' '}
                  of{' '}
                  <span className='seconds-total'>
                    {this.displaySeconds(state.audioBuffer.duration)}
                  </span>{' '}
                  (from{' '}
                  <span className='seconds-start'>
                    {this.displaySeconds(state.startTime)}
                  </span>{' '}
                  to{' '}
                  <span className='seconds-end'>
                    {this.displaySeconds(state.endTime)}
                  </span>
                  )
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}

export default MusicTrimmer

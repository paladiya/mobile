import React, { Component } from 'react'
import './style.scss'
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share'

export class SharePopup extends Component {
  closeBtn = () => {
    // const modal = document.getElementById('modal')
    // modal.style.display = 'none'
    this.props.hide()
  }

  copyToClipboard = () => {
    // navigator.clipboard.writeText(`${this.props.shareLink}`)
    const copy = document.getElementById('shareLink')
    copy.select()
    copy.setSelectionRange(0, 9999)
    document.execCommand('copy')
  }

  render () {
    return (
      <div className='modal model ' id='modal' tabIndex='-1' role='dialog'>
        <div className='modal-dialog dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>Share item</h5>
              <button
                onClick={this.closeBtn}
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body body'>
              <input
                id='shareLink'
                className='form-control'
                type='text'
                value={this.props.shareLink}
                readOnly='readonly'
              />
              <button
                type='button'
                onClick={this.copyToClipboard}
                className='btn btn-primary mx-3'
              >
                copy
              </button>
            </div>
            <div className='modal-footer d-flex justify-content-center'>
              <FacebookShareButton
                url={this.props.shareLink}
                quote='Facebook Share'
                onShareWindowClose={() => {
                  this.props.hide()
                }}
              >
                <FacebookIcon size={42} round />
              </FacebookShareButton>
              <PinterestShareButton
                url={this.props.shareLink}
                media={this.props.img}
              >
                <PinterestIcon size={42} round />
              </PinterestShareButton>
              <WhatsappShareButton
                url={this.props.shareLink}
                media={this.props.img}
              >
                <WhatsappIcon size={42} />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SharePopup

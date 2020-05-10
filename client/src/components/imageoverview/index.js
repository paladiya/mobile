import './style.scss'
import React from 'react'
import Img from 'react-image'
import { GridLoader } from 'react-spinners'
import ZoomIn from '../../assets/svg/zoom-in.svg'
import ZoomOut from '../../assets/svg/zoom-out.svg'

export default function ImageOverView (props) {
  const onLoadComplete = () => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div>
      <div className='card card-preview'>
        <Img
          className={!props.isZoom ? 'img-preview card-img' : 'zoom-in'}
          src={`/api/${props.item.types}/resize/${props.item.fileName}`}
          loader={<GridLoader size={20} margin={10} />}
          unloader={<GridLoader size={20} margin={10} />}
          onLoad={onLoadComplete}
        />

        <div onClick={props.toggleZoom} className='img-zoom'>
          {props.isZoom ? (
            <img src={ZoomOut} width={40} height={40} />
          ) : (
            <img src={ZoomIn} width={40} height={40} />
          )}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import Img from 'react-image'
import { GridLoader } from 'react-spinners'
import './style.scss'

export default function ImageOverView (props) {
  const toggleZoom = () => {
    if (this.state.isZoom) {
    } else {
    }
  }

  return (
    <div>
      <div className='card card-preview'>
        <Img
          className='img-preview card-img'
          src={`/api/${props.item.types}/resize/${props.item.fileName}`}
          loader={<GridLoader size={20} margin={10} />}
          unloader={<GridLoader size={20} margin={10} />}
          onClick={toggleZoom}
        />
      </div>
    </div>
  )
}

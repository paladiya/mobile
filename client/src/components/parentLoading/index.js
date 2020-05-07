import React from 'react'
import './style.scss'
import { RingLoader } from 'react-spinners'

export default function ParentLoading () {
  return (
    <div className='loading'>
      <div className='waves'>
        <RingLoader size={200} />
      </div>
    </div>
  )
}

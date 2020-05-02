import React from 'react'
import './style.scss'
import { RingLoader } from 'react-spinners'

export default function ParentLoading () {
  return (
    <div className='loading'>
      <RingLoader className='m-auto align-self-center' size={120} />
    </div>
  )
}

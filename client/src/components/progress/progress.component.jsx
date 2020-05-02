import React from 'react'

export default function ProgressComponent ({ percentage }) {
  return (
    percentage>0 && (<div
      className='progress-bar progress-bar-striped bg-success mt-3'
      role='progressbar'
      style={{ width: `${percentage}%`, height: '50px' }}
    >
      {percentage}%
    </div>)
  )
}

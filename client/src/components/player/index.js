import React from 'react'
// Import module and default styles
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function Player () {
  let percentage = 80
  return (
    <div>
      <CircularProgressbar percentage={percentage} text={`${percentage}%`} />
    </div>
  )
}

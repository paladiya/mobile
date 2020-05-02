import React from 'react'

export default function Message (props) {
  return (
    props.message &&
    (props.success ? (
      <div className='alert alert-success  fade show my-2' role='alert'>
        {props.message}
      </div>
    ) : (
      <div className='alert alert-danger  fade show my-2' role='alert'>
        {props.message}
      </div>
    ))
  )
}

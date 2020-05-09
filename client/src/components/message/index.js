import React from 'react'

const Message = React.forwardRef((props, ref) => {
  console.log(ref)
  return (
    props.message &&
    (props.success ? (
      <div
        className='alert alert-success  fade show my-2'
        role='alert'
        ref={ref}
      >
        {props.message}
      </div>
    ) : (
      <div
        className='alert alert-danger  fade show my-2'
        role='alert'
        ref={ref}
      >
        {props.message}
      </div>
    ))
  )
})

export default Message

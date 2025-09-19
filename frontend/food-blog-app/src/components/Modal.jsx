import React from 'react';

function Modal(props) {
  return (
    <>
        <div className='backdrop' onClick={props.closeModal}>
        </div>
        <dialog className='modal' open >
          {props.children}
        </dialog>
    </>
  )
}

export default Modal;
import React from 'react'

import { Props } from './types'

import './Modal.css'

export default function Modal(props: Props) {
  const { onClose, className, children } = props

  return (
    <div className={`Modal ${className}`}>
      <div className="modal-wrapper">
        <div className="modal-header">
          <button className="close" onClick={onClose}></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

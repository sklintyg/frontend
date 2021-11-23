import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

const move = keyframes`
   0%   {top: -100px; opacity: 0%;}
  12.5%  {top: 170px; opacity: 100%;}
  87.5%  {top: 170px; opacity: 100%;}
  100% {top: -100px; opacity: 0%;}
`

const AnimatedDiv = styled.div`
  position: absolute;
  opacity: 0%;
  top: -100px;
  animation: ${move} 2s cubic-bezier(0.39, 0.58, 0.57, 1);
`

const ToastModal: React.FC = ({ children }) => {
  const [open, setOpen] = useState(true)
  const [allowClosingOfModal, setAllowClosingOfModal] = useState(false)

  useEffect(() => {
    setTimeout(() => setAllowClosingOfModal(true), 1000)
    setTimeout(() => setOpen(false), 2000)
  }, [])

  if (!open) return null

  const handleClose = () => {
    if (!allowClosingOfModal) return

    setOpen(false)
  }

  return (
    <div className={'ic-backdrop'} onClick={handleClose}>
      <AnimatedDiv role="dialog" className="ic-modal" aria-labelledby="demo-modal-content">
        <div className="ic-modal__body ic-text">{children}</div>
      </AnimatedDiv>
    </div>
  )
}

export default ToastModal

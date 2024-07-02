import type React from 'react';
import { useEffect, useState } from 'react'
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

interface Props {
  onClose?: () => void
}

const ToastModal: React.FC<Props> = ({ children, onClose }) => {
  const [open, setOpen] = useState(true)
  const [allowClosingOfModal, setAllowClosingOfModal] = useState(false)

  useEffect(() => {
    const allowClosingOfModalTimeout = setTimeout(() => setAllowClosingOfModal(true), 1000)
    const openTimeout = setTimeout(() => {
      setOpen(false)
      onClose?.()
    }, 2000)
    return () => {
      clearTimeout(allowClosingOfModalTimeout)
      clearTimeout(openTimeout)
    }
  }, [onClose])

  if (!open) return null

  const handleClose = () => {
    if (!allowClosingOfModal) return

    setOpen(false)
    onClose?.()
  }

  return (
    <div role="none" className={'ic-backdrop'} onClick={handleClose}>
      <AnimatedDiv role="dialog" className="ic-modal" aria-labelledby="demo-modal-content">
        <div className="ic-modal__body ic-text">{children}</div>
      </AnimatedDiv>
    </div>
  )
}

export default ToastModal

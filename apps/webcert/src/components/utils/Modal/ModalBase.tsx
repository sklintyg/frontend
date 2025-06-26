import FocusTrap from 'focus-trap-react'
import type React from 'react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

const ModalContentWrapper = styled.div`
  p + p {
    margin-top: 0.25em !important;
  }
`

const WrapText = styled.div`
  white-space: normal;
`

interface Props {
  open: boolean
  handleClose: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  title: string
  buttons: React.ReactNode
  content: React.ReactNode
  enableCross?: boolean
  className?: string
  focusTrap?: boolean
  closeOnBackdropClick?: boolean
}

const ModalBase = ({
  open,
  handleClose,
  title,
  buttons,
  content,
  enableCross,
  className,
  focusTrap = true,
  closeOnBackdropClick = true,
}: Props) => {
  const backdropRef = useRef<HTMLDivElement | null>(null)
  const rootElement = document.getElementById('modalRoot')

  if (!open || !rootElement) {
    return null
  }

  return createPortal(
    <FocusTrap
      active={open && focusTrap}
      focusTrapOptions={{
        tabbableOptions: {
          displayCheck: 'none',
        },
      }}
    >
      <div
        role="none"
        className="ic-backdrop iu-lh-body"
        ref={backdropRef}
        data-testid="modal-backdrop"
        onClick={(event) => {
          if (closeOnBackdropClick && backdropRef.current === event.target) {
            handleClose(event)
          }
        }}
      >
        <WrapText role="dialog" className={`ic-modal ${className}`} aria-labelledby="dialog-title" aria-modal="true">
          {enableCross && (
            <button type="button" aria-label="Close modal" onClick={handleClose} className="ic-modal__close ic-svg-icon">
              <svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 10.733l5.07-5.07c.35-.35.917-.35 1.267 0 .35.35.35.917 0 1.267L13.267 12l5.07 5.07c.35.35.35.917 0 1.267-.35.35-.917.35-1.267 0L12 13.267l-5.07 5.07c-.35.35-.917.35-1.267 0-.35-.35-.35-.917 0-1.267l5.07-5.07-5.07-5.07c-.35-.35-.35-.917 0-1.267.35-.35.917-.35 1.267 0l5.07 5.07z"
                  transform="translate(-994 -650) translate(410 637) translate(584 13)"
                />
              </svg>
            </button>
          )}
          <div className="ic-modal__head" id="demo-modal-content">
            <h3 id="dialog-title">{title}</h3>
          </div>
          <ModalContentWrapper className="ic-modal__body ic-text">{content}</ModalContentWrapper>
          <div data-testid="modal-buttons" className="ic-button-group ic-button-group--right">
            {buttons}
          </div>
        </WrapText>
      </div>
    </FocusTrap>,
    rootElement
  )
}

export default ModalBase

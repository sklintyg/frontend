import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useAppDispatch } from '../../../store/store'
import { getCertificateTypeInfoModal } from '../../../store/patient/patientThunks'
import type { CertificateTypeInfoModalData } from '../../../types'
import { useKeyPress } from '../../../utils'
import TextWithDynamicLinks from '../../../utils/TextWithDynamicLinks'
import { CustomButton } from '../../Inputs/CustomButton'
import ModalBase from './ModalBase'

const ModalContent = styled.div`
  white-space: pre-line;

  p + p {
    margin-top: 0.7em !important;
  }
`

interface Props {
  certificateType: string
  patientId: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const CertificateTypeInfoModal = ({ certificateType, patientId, open, setOpen }: Props) => {
  const dispatch = useAppDispatch()
  const escPress = useKeyPress('Escape')
  const [modalData, setModalData] = useState<CertificateTypeInfoModalData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
    setModalData(null)
  }, [setOpen])

  useEffect(() => {
    if (open && !modalData) {
      setLoading(true)
      dispatch(getCertificateTypeInfoModal({ certificateType, patientId }))
        .unwrap()
        .then((data) => {
          setModalData(data)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, certificateType, patientId, dispatch, modalData])

  useEffect(() => {
    if (escPress) {
      handleClose()
    }
  }, [escPress, handleClose])

  if (!open) {
    return null
  }

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      title={modalData?.title ?? 'Laddar...'}
      content={
        <ModalContent>
          {loading && <p>Laddar...</p>}
          {!loading && modalData && <TextWithDynamicLinks text={modalData.description} />}
        </ModalContent>
      }
      buttons={<CustomButton onClick={handleClose} buttonStyle="primary" text="Stäng" />}
    />
  )
}

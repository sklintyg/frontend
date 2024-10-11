import type React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getSigningStatus } from '../../../store/certificate/certificateSelectors'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { CertificateSignStatus } from '../../../types'
import { useAppDispatch } from '../../../store/store'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import InfoBox from '../../../components/utils/InfoBox'
import { Link } from 'react-router-dom'
import ExternalLinkIcon from '../../../components/image/image/ExternalLinkIcon'
import { startSignCertificate, updateCertificateSignStatus } from '../../../store/certificate/certificateActions'

export const SignCertificateErrorModal: React.FC = () => {
  const signStatus = useSelector(getSigningStatus)
  const dispatch = useAppDispatch()
  const [openErrorModal, setOpenErrorModal] = useState(false)

  const onCancel = () => {
    setOpenErrorModal(false)
    dispatch(updateCertificateSignStatus(CertificateSignStatus.ABORT))
  }

  const onTryAgain = () => {
    setOpenErrorModal(false)
    dispatch(startSignCertificate())
  }

  useEffect(() => {
    if (
      signStatus == CertificateSignStatus.FAILED ||
      signStatus == CertificateSignStatus.UNKNOWN ||
      signStatus === CertificateSignStatus.NO_CLIENT
    ) {
      setOpenErrorModal(true)
    }
  }, [signStatus])

  return (
    <ModalBase
      open={openErrorModal}
      focusTrap={false}
      handleClose={onCancel}
      title={'Någonting gick fel'}
      buttons={
        <>
          <CustomButton buttonStyle="primary" text="Försök igen" onClick={onTryAgain} />
          <CustomButton text="Avbryt" onClick={onCancel} />
        </>
      }
      content={
        <>
          <InfoBox type="error">
            Signeringen avbröts, eller tog för lång tid. Av säkerhetsskäl finns det en tidsbegränsning. <br /> Vänligen försök igen.
          </InfoBox>
          <h5 className="ids-heading-h5 iu-pt-500 iu-pb-200">Problem att signera?</h5>
          <Link target="_blank" to="https://test.bankid.com/">
            Här kan du testa att ditt BankID fungerar om du har problem med att signera.
            <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
          </Link>
        </>
      }
    />
  )
}

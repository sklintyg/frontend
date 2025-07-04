import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CustomButton } from '../../../components/Inputs/CustomButton'
import QRCode from '../../../components/qrcode/QRCode'
import ModalBase from '../../../components/utils/Modal/ModalBase'
import { bankIdLogoImage } from '../../../images'
import { updateCertificateSignStatus } from '../../../store/certificate/certificateActions'
import { getQrCodeForElegSignature, getSigningStatus } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch, useAppSelector } from '../../../store/store'
import { getUser } from '../../../store/user/userSelectors'
import { CertificateSignStatus, SigningMethod } from '../../../types'

const BankIDLogo = styled.img`
  width: 60%;
`

export function SignCertificateModal() {
  const signStatus = useAppSelector(getSigningStatus)
  const signingMethod = useAppSelector((state) => getUser(state)?.signingMethod)
  const dispatch = useAppDispatch()
  const qrCode = useAppSelector((state) => getQrCodeForElegSignature(state))
  const [correctSigningStatus, setCorrectSigningStatus] = useState(false)

  const onCancel = () => {
    dispatch(updateCertificateSignStatus(CertificateSignStatus.ABORT))
  }

  useEffect(() => {
    setCorrectSigningStatus(signStatus === CertificateSignStatus.PROCESSING || signStatus === CertificateSignStatus.WAIT_FOR_SIGN)
  }, [signStatus])

  return (
    <ModalBase
      open={correctSigningStatus}
      focusTrap={false}
      handleClose={onCancel}
      title="Signera intyget med BankID"
      buttons={<CustomButton text={'Avbryt'} onClick={onCancel} />}
      content={
        <>
          {signingMethod === SigningMethod.BANK_ID && (
            <div className="iu-flex-center">
              <BankIDLogo src={bankIdLogoImage} alt="BankID Logo" />
            </div>
          )}
          {signingMethod === SigningMethod.MOBILT_BANK_ID && (
            <>
              <div className="iu-flex-center">
                <QRCode qrCode={qrCode} />
              </div>
              <h5 className="ids-heading-h5 iu-pb-200">För att signera intyget</h5>
              <div className="ml-5">
                <p>1. Öppna appen för BankID.</p>
                <p>2. Tryck på QR-symbolen i appen för BankID.</p>
                <p>3. Rikta kameran mot QR-koden ovan.</p>
                <p>4. Följ instruktionerna i appen för att signera.</p>
              </div>
            </>
          )}
        </>
      }
    />
  )
}

import type React from 'react'
import { useEffect, useState } from 'react'
import type { QRCodeRenderersOptions } from 'qrcode'
import QRCode from 'qrcode'

const qrCodeOptions: QRCodeRenderersOptions = {
  width: 200,
  margin: 3,
  errorCorrectionLevel: 'L',
}

interface Props {
  qrCode: string
}

const QrCode: React.FC<Props> = ({ qrCode }) => {
  const [qrImage, setQrImage] = useState<string>()

  useEffect(() => {
    let setState = true
    QRCode.toDataURL(qrCode, qrCodeOptions)
      .then((url) => {
        if (setState) {
          setQrImage(url)
        }
      })
      .catch(() => {
        if (setState) {
          setQrImage(undefined)
        }
      })
    return () => {
      setState = false
    }
  }, [qrCode])

  if (!qrImage) {
    return null
  }

  return (
    <>
      <img src={qrImage} alt={'QR-kod'} />
    </>
  )
}

export default QrCode

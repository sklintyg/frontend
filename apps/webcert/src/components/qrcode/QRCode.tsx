import { useEffect, useState } from 'react'
import type { QRCodeRenderersOptions } from 'qrcode'
import QRCode from 'qrcode'

const qrCodeOptions: QRCodeRenderersOptions = {
  width: 200,
  margin: 3,
  errorCorrectionLevel: 'L',
}

export function QrCode({ qrCode }: { qrCode: string }) {
  const [qrImage, setQrImage] = useState<string>()

  useEffect(() => {
    let isMounted = true

    const getQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(qrCode, qrCodeOptions)
        if (isMounted) {
          setQrImage(url)
        }
      } catch (error) {
        if (isMounted) {
          setQrImage(undefined)
        }
      }
    }
    getQRCode()

    return () => {
      isMounted = false
    }
  }, [qrCode])

  if (!qrImage) {
    return null
  }

  return <img src={qrImage} alt={'QR-kod'} />
}

export default QrCode

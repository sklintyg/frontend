import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getSigningData } from '../../../store/certificate/certificateSelectors'

const SigningForm: React.FC = () => {
  const signingData = useSelector(getSigningData)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (signingData) {
      formRef.current?.submit()
    }
  }, [signingData])

  if (!signingData) return null

  return (
    <>
      <form ref={formRef} action={signingData.actionUrl} method="POST">
        <input hidden={true} type="text" name="Binding" value={'POST/XML/1.0'} />
        <input hidden={true} type="text" name="RelayState" value={signingData.id} />
        <input hidden={true} type="text" name="EidSignRequest" value={signingData.signRequest} />
        <input hidden={true} type="submit" />
      </form>
    </>
  )
}


export default SigningForm

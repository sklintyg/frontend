import { useEffect, useRef } from 'react'
import { shallowEqual } from 'react-redux'
import { getSigningData } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'

const SigningForm = () => {
  const signingData = useAppSelector(getSigningData, shallowEqual)
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
        <input hidden={true} type="text" name="Binding" defaultValue={'POST/XML/1.0'} />
        <input hidden={true} type="text" name="RelayState" defaultValue={signingData.id} />
        <input hidden={true} type="text" name="EidSignRequest" defaultValue={signingData.signRequest} />
        <input hidden={true} type="submit" />
      </form>
    </>
  )
}

export default SigningForm

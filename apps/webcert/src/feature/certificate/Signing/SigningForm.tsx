import { useEffect, useRef } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getSigningData } from '../../../store/certificate/certificateSelectors'

const SigningForm = () => {
  const signingData = useSelector(getSigningData, shallowEqual)
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

import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getSigning } from '../../../store/certificate/certificateSelectors'

const SigningForm: React.FC = () => {
  const signing = useSelector(getSigning)
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef && signing) {
      const form = (formRef.current as unknown) as HTMLFormElement
      form.submit()
    }
  }, [signing])

  //const url = window.location.origin.replace('wc2.', '') + '/visa/intyg/' + certificateId

  if (!signing) return null

  return (
    <>
      <form ref={formRef} action={signing.actionUrl} method="POST">
        <input hidden={true} type="text" name="Binding" value={'POST/XML/1.0'} />
        <input hidden={true} type="text" name="RelayState" value={signing.id} />
        <input hidden={true} type="text" name="EidSignRequest" value={signing.signRequest} />
        <input hidden={true} type="submit" />
      </form>
    </>
  )
}

export default SigningForm

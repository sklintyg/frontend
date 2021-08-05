import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getSigning } from '../../../store/certificate/certificateSelectors'

const SigningForm: React.FC = () => {
  const signing = useSelector(getSigning)
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (signing) {
      formRef.current?.submit()
    }
  }, [signing])

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

import React, { useEffect, useRef } from 'react'
import { Backdrop } from '@frontend/common'

interface Props {
  certificateId: string
  unitId: string
  sjf: boolean
}

const WelcomeDeepIntegration: React.FC<Props> = ({ certificateId, unitId, sjf }) => {
  const formRef = useRef(null)

  useEffect(() => {
    if (formRef) {
      const form = (formRef.current as unknown) as HTMLFormElement
      form.submit()
    }
  }, [])

  const url = window.location.origin + '/visa/intyg/' + certificateId

  return (
    <>
      <Backdrop open={true} spinnerText={'Hoppar till Webcert!'} />
      <form ref={formRef} action={url} method="POST">
        <input hidden={true} type="text" name="enhet" value={unitId} />
        <input hidden={true} type="text" name="sjf" value={String(sjf)} />
        <input hidden={true} type="submit" />
      </form>
    </>
  )
}

export default WelcomeDeepIntegration

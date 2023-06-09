import { useEffect, useRef, useState } from 'react'
import { IDSButton, IDSDialog, IDSDialogActions, IDSDialogElement } from '@frontend/ids-react-ts/src'
import { useDispatch } from 'react-redux'
import { ErrorId } from './ErrorId'
import { api } from '../store/api'
import { uuidv4 } from './util/errorUtils'

export function ErrorModal({
  description,
  show,
  errorCode,
  generateError,
}: {
  description: string
  show: boolean
  errorCode: string
  generateError: boolean
}) {
  const ref = useRef<IDSDialogElement>(null)
  const [errorId, setErrorId] = useState('')
  const close = () => ref.current?.hideDialog()
  const dispatch = useDispatch()

  useEffect(() => {
    if (show && generateError) {
      const generatedErrorId = uuidv4()
      setErrorId(generatedErrorId)
      const errorData = {
        errorId: generatedErrorId,
        errorCode,
        message: description,
        stackTrace: null,
      }

      dispatch(api.endpoints.logError.initiate({ errorData, ...errorData }))
    }
  }, [show, dispatch, description, errorCode, generateError])

  return (
    <IDSDialog dismissible headline="Tekniskt fel" ref={ref} show={show}>
      {description}
      {errorId && <ErrorId errorId={errorId} />}
      <IDSDialogActions>
        <IDSButton secondary onClick={close}>
          Stäng
        </IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}

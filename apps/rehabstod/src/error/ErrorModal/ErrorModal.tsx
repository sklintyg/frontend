import { useEffect, useRef, useState } from 'react'
import { IDSButton, IDSDialog, IDSDialogActions, IDSDialogElement } from '@frontend/ids-react-ts'
import { ErrorId } from '../ErrorId/ErrorId'
import { api, useGetLinksQuery } from '../../store/api'
import { uuidv4 } from '../util/errorUtils'
import { DynamicLink } from '../../components/DynamicLink/DynamicLink'
import { useAppDispatch } from '../../store/hooks'

export function ErrorModal({
  description,
  show,
  errorCode,
  generateError,
  dynamicLink,
}: {
  description: string
  show?: boolean
  errorCode: string
  generateError: boolean
  dynamicLink: boolean
}) {
  const ref = useRef<IDSDialogElement>(null)
  const [errorId, setErrorId] = useState('')
  const { data: links } = useGetLinksQuery()
  const close = () => ref.current?.hideDialog()
  const dispatch = useAppDispatch()

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
    <IDSDialog dismissible headline="Tekniskt fel" ref={ref} show={show ? 'true' : 'false'}>
      {description} Om problemet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
      {dynamicLink ? <DynamicLink type="footer" link={links?.ineraNationellKundservice} /> : ''}.{errorId && <ErrorId errorId={errorId} />}
      <IDSDialogActions>
        <IDSButton secondary onClick={close}>
          Stäng
        </IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}

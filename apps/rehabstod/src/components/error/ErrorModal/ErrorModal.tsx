import { IDSButton, IDSDialog, IDSDialogActions, IDSDialogElement } from '@frontend/ids-react-ts'
import { useEffect, useRef, useState } from 'react'
import { api, useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { uuidv4 } from '../../../utils/uuidv4'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { DisplayErrorIdentifier } from '../DisplayErrorIdentifier/DisplayErrorIdentifier'

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
      dispatch(
        api.endpoints.logError.initiate({
          errorData: {
            errorId: generatedErrorId,
            errorCode,
            message: description,
            stackTrace: null,
          },
        })
      )
    }
  }, [show, dispatch, description, errorCode, generateError])

  return (
    <IDSDialog dismissible headline="Tekniskt fel" ref={ref} show={show ? 'true' : 'false'}>
      <p className="mb-5">
        {description} Om problemet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        {dynamicLink && <DynamicLink type="footer" link={links?.ineraNationellKundservice} />}.
      </p>
      {errorId && <DisplayErrorIdentifier id={errorId} />}
      <IDSDialogActions>
        <IDSButton secondary onClick={close}>
          Stäng
        </IDSButton>
      </IDSDialogActions>
    </IDSDialog>
  )
}

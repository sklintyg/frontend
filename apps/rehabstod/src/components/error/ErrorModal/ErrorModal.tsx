import { ErrorIdentifier } from '@frontend/components'
import { IDSButton, IDSDialog, IDSDialogElement } from '@frontend/ids-react-ts'
import { randomUUID } from '@frontend/utils'
import { useEffect, useRef, useState } from 'react'
import { ErrorCode } from '../../../schemas/errorSchema'
import { api, useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { DynamicLink } from '../../DynamicLink/DynamicLink'

export function ErrorModal({
  description,
  show,
  errorCode,
  generateError,
  dynamicLink,
}: {
  description: string
  show?: boolean
  errorCode: ErrorCode
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
      const generatedErrorId = randomUUID()
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
    <IDSDialog dismissible ref={ref} show={show ? 'true' : 'false'}>
      <h3 className="ids-heading-1" slot="headline">
        Tekniskt fel
      </h3>
      <p className="mb-5">
        {description} Om problemet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        {dynamicLink && <DynamicLink type="footer" link={links?.ineraNationellKundservice} />}.
      </p>
      {errorId && <ErrorIdentifier id={errorId} />}
      <IDSButton slot="action" secondary onClick={close}>
        Stäng
      </IDSButton>
    </IDSDialog>
  )
}

import { Button, Dialog } from '@frontend/components'
import { randomUUID } from '@frontend/utils'
import { useEffect, useState } from 'react'
import type { ErrorCode } from '../../../schemas/errorSchema'
import { api, useGetLinksQuery } from '../../../store/api'
import { useAppDispatch } from '../../../store/hooks'
import { DynamicLink } from '../../DynamicLink/DynamicLink'
import { ErrorIdentifier } from '../ErrorIdentifier'

export function ErrorModal({
  description,
  errorCode,
  generateError,
  dynamicLink,
}: {
  description: string
  errorCode: ErrorCode
  generateError: boolean
  dynamicLink: boolean
}) {
  const errorId = randomUUID()
  const { data: links } = useGetLinksQuery()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (generateError) {
      dispatch(
        api.endpoints.logError.initiate({
          errorData: {
            errorId,
            errorCode,
            message: description,
            stackTrace: null,
          },
        })
      )
    }
  }, [dispatch, description, errorCode, generateError, errorId])

  return (
    <Dialog dismissible open={open} headline="Tekniskt fel">
      <p className="mb-5">
        {description} Om problemet kvarstår, kontakta i första hand din lokala IT-support och i andra hand{' '}
        {dynamicLink && <DynamicLink link={links?.ineraNationellKundservice} />}.
      </p>
      {generateError && <ErrorIdentifier id={errorId} />}
      <div slot="actions">
        <Button secondary onClick={() => setOpen(false)}>
          Stäng
        </Button>
      </div>
    </Dialog>
  )
}

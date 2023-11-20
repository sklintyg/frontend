import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorPageHero } from '../../components/error/ErrorPageHero'
import { ErrorCode, ErrorTypeEnum } from '../../schema/error.schema'
import { useLogErrorMutation } from '../../store/api'
import { useAppSelector } from '../../store/hooks'

export function ErrorPage() {
  const { id, type } = useParams<{ id?: string; type?: ErrorTypeEnum }>()
  const hasSession = useAppSelector((state) => state.sessionSlice.hasSession)
  const [logError] = useLogErrorMutation()

  useEffect(() => {
    if (id && hasSession) {
      logError({
        id,
        code: type === 'login-failed' ? ErrorCode.enum.LOGIN_FAILED : ErrorCode.enum.CUSTOM_ERROR,
        message: 'NO_MESSAGE',
      })
    }
  }, [id, logError, hasSession, type])

  return <ErrorPageHero id={id} type={type} />
}

import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { IDSContainer, IDSIconChevron, IDSLink } from '@frontend/ids-react-ts'
import { useAppDispatch } from '../../store/hooks'
import { api } from '../../store/api'
import { PageHero } from '../../components/PageHero/PageHero'
import { ErrorCodeEnum } from '../../schemas/errorSchema'
import { uuidv4 } from '../../components/error/util/errorUtils'
import { DisplayRoutingError } from '../../components/error/DisplayRoutingError'
import { ErrorIdentifier } from '../../components/error/ErrorIdentifier/ErrorIdentifier'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReasonParamErrorCodeMap = new Map<string, ErrorCodeEnum>([
  ['login.failed', ErrorCodeEnum.enum.LOGIN_FAILED],
  ['login.hsaerror', ErrorCodeEnum.enum.LOGIN_HSA_ERROR],
  ['login.medarbetaruppdrag', ErrorCodeEnum.enum.LOGIN_MEDARBETARUPPDRAG_SAKNAS],
  ['login.saknar-hsa-rehabroll', ErrorCodeEnum.enum.LOGIN_SAKNAR_HSA_REHABROLL],
  ['unknown', ErrorCodeEnum.enum.UNKNOWN_INTERNAL_ERROR],
])

export function Error() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { current: errorId } = useRef(uuidv4())
  const [searchParams] = useSearchParams()
  const reason = searchParams.get('reason')
  const errorCode = ReasonParamErrorCodeMap.get(reason ?? 'unknown')

  useEffect(() => {
    if (location.search) {
      dispatch(
        api.endpoints.logError.initiate({
          errorData: {
            errorId,
            errorCode,
            message: reason ?? 'unknown',
            stackTrace: null,
          },
        })
      )
    }
  }, [dispatch, errorId, location.search])

  return (
    <IDSContainer>
      <PageHero type="error">
        <DisplayRoutingError errorCode={errorCode} />
        <ErrorIdentifier id={errorId} />
      </PageHero>
      <div className="text-center">
        <IDSLink>
          <IDSIconChevron />
          <Link to="/">Till startsidan</Link>
        </IDSLink>
      </div>
    </IDSContainer>
  )
}

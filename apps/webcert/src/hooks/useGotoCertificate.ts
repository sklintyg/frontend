import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { gotoCertificateDone } from '../store/certificate/certificateActions'
import { useAppDispatch, useAppSelector } from '../store/store'

export function useGotoCertificate() {
  const dispatch = useAppDispatch()
  const history = useHistory<{ from?: string }>()
  const shouldRedirect = useAppSelector((state) => Boolean(state.ui.uiCertificate.goto))
  const shouldReplace = useAppSelector((state) => state.ui.uiCertificate.goto?.replace ?? false)
  const url = useAppSelector((state) => `/certificate/${state.ui.uiCertificate.goto?.id}`)

  useEffect(() => {
    if (shouldRedirect) {
      if (shouldReplace) {
        const from = history.location.state?.from ?? ''
        if (from === url) {
          history.goBack()
        } else {
          history.replace(url)
        }
      } else {
        history.push(url, { from: history.location.pathname })
      }
      dispatch(gotoCertificateDone())
    }
  }, [dispatch, history, shouldRedirect, shouldReplace, url])
}

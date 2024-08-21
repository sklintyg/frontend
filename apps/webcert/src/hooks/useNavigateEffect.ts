import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { reset } from '../store/navigateSlice'
import { useAppDispatch, useAppSelector } from '../store/store'

export function useNavigateEffect() {
  const dispatch = useAppDispatch()
  const history = useHistory<{ from?: string }>()
  const pathname = useAppSelector((state) => state.ui.uiNavigation.pathname)
  const shouldReplace = useAppSelector((state) => state.ui.uiNavigation.replace)

  useEffect(() => {
    if (pathname) {
      if (shouldReplace) {
        const from = history.location.state?.from ?? ''
        if (from === pathname) {
          history.goBack()
        } else {
          history.replace(pathname)
        }
      } else {
        history.push(pathname, { from: history.location.pathname })
      }
      dispatch(reset())
    }
  }, [dispatch, history, shouldReplace, pathname])
}

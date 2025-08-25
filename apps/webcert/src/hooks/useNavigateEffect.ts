import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { reset } from '../store/navigateSlice'
import { useAppDispatch, useAppSelector } from '../store/store'

export function useNavigateEffect() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = useAppSelector((state) => state.ui.uiNavigation.pathname)
  const shouldReplace = useAppSelector((state) => state.ui.uiNavigation.replace)

  useEffect(() => {
    if (pathname) {
      if (shouldReplace) {
        const from = location.state?.from ?? ''
        if (from === pathname) {
          navigate(-1)
        } else {
          navigate(pathname, { replace: true })
        }
      } else {
        navigate(pathname, { state: { from: window.location.pathname } })
      }
      dispatch(reset())
    }
  }, [dispatch, shouldReplace, pathname, navigate, location.state?.from])
}

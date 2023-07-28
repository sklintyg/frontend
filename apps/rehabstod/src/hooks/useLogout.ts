import { useNavigate } from 'react-router-dom'
import { useFakeLogoutMutation, useGetUserQuery } from '../store/api'
import { useAppDispatch } from '../store/hooks'
import { resetSickLeaveFilters } from '../store/slices/sickLeave.slice'
import { resetLUFilters } from '../store/slices/luCertificates.slice'

export function useLogout() {
  const { data: user } = useGetUserQuery()
  const [fakeLogout] = useFakeLogoutMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return {
    logout: () => {
      dispatch(resetSickLeaveFilters())
      dispatch(resetLUFilters())
      if (!user || user.authenticationScheme === 'urn:inera:rehabstod:siths:fake') {
        fakeLogout()
        navigate('/welcome')
      } else {
        window.open('/saml/logout', '_self')
      }
    },
  }
}

import { useNavigate } from 'react-router-dom'
import { useFakeLogoutMutation } from '../store/testabilityApi'

export function useLogout() {
  const [fakeLogout] = useFakeLogoutMutation()
  const navigate = useNavigate()

  return () => {
    fakeLogout()
    navigate('/welcome')
  }
}

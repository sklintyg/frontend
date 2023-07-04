import { useNavigate } from 'react-router-dom'
import { useGetUserQuery } from '../store/api'

export function useNavigateToStartPage() {
  const { isLoading, data: user } = useGetUserQuery()
  const navigate = useNavigate()

  return {
    navigate: () => {
      if (!isLoading && !user) {
        navigate('/')
      }
    },
  }
}

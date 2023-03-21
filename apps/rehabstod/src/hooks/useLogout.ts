import { useNavigate } from 'react-router-dom'

function fakeLogout() {
  return fetch('/logout', {
    body: new FormData(),
    method: 'post',
  })
}

export function useLogout() {
  const navigate = useNavigate()

  return {
    logout: () => {
      fakeLogout()
      navigate('/welcome')
    },
  }
}

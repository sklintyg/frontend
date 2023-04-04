import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { reset } from '../../store/sickLeaveSlice'
import { useAppDispatch } from '../../store/store'

export function CurrentSickLeaves() {
  const dispatch = useAppDispatch()

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  return <Outlet />
}

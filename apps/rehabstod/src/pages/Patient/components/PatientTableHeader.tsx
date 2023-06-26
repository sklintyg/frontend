import { useEffect, useRef } from 'react'
import { TableHeaderCell } from '../../../components/Table/tableHeader/TableHeaderCell'
import { useAppSelector } from '../../../store/hooks'
import { allPatientColumns } from '../../../store/slices/patientTableColumns.selector'
import { PatientColumn } from '../../../store/slices/patientTableColumns.slice'

function PatientTableHeaderResolver({ column }: { column: string }) {
  switch (column) {
    case PatientColumn.Num:
      return <TableHeaderCell column={column} width="62px" />
    case PatientColumn.Diagnos:
      return <TableHeaderCell column={column} width="255px" />
    case PatientColumn.Startdatum:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Slutdatum:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Längd:
      return <TableHeaderCell column={column} width="90px" />
    case PatientColumn.Grad:
      return <TableHeaderCell column={column} width="100px" />
    case PatientColumn.Ärenden:
      return <TableHeaderCell column={column} width="170px" />
    case PatientColumn.Läkare:
      return <TableHeaderCell column={column} width="114px" />
    case PatientColumn.Sysselsättning:
      return <TableHeaderCell column={column} width="140px" />
    case PatientColumn.Vårdenhet:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Vårdgivare:
      return <TableHeaderCell column={column} width="120px" />
    case PatientColumn.Intyg:
      return <TableHeaderCell column={column} width="80px" sticky="right" />
    default:
      return null
  }
}

export function PatientTableHeader({ isDoctor }: { isDoctor: boolean }) {
  const columns = useAppSelector(allPatientColumns)
  const normalHeader = useRef<HTMLTableSectionElement>(null)
  const fixedHeader = useRef<HTMLTableSectionElement>(null)
  const outerDiv = useRef<HTMLDivElement>(null)
  const innerDiv = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleScroll = () => {
      document.getElementById('scrollDiv')?.addEventListener('scroll', handleScroll)
      if (normalHeader.current && fixedHeader.current && outerDiv.current && innerDiv.current) {
        const { top, width } = normalHeader.current.getBoundingClientRect()
        const contentWidth = document.getElementById('contentDiv')?.getBoundingClientRect().width
        const bottom = document.getElementById('contentDiv')?.getBoundingClientRect().bottom
        const scrollLeft = document.getElementById('scrollDiv')?.scrollLeft
        if (top < 50 && bottom && bottom > 50) {
          innerDiv.current.style.width = `${width + (scrollLeft ?? 0)}px`
          outerDiv.current.style.width = `${width}px`
          fixedHeader.current.style.width = `${contentWidth}px`
          fixedHeader.current.classList.remove('hidden')
        } else {
          fixedHeader.current.classList.add('hidden')
        }
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <>
      <thead ref={normalHeader}>
        {columns.length > 0 && (
          <tr>
            {columns
              .filter(({ visible: checked }) => checked)
              .filter(({ name }) => !(isDoctor && name === PatientColumn.Läkare))
              .map(({ name }) => (
                <PatientTableHeaderResolver key={name} column={name} />
              ))}
          </tr>
        )}
      </thead>
      <thead ref={fixedHeader} className="fixed top-[56px] z-40 hidden overflow-hidden">
        <div ref={outerDiv} className="mx-auto">
          <div ref={innerDiv} className="float-right">
            {columns.length > 0 && (
              <tr>
                {columns
                  .filter(({ visible: checked }) => checked)
                  .filter(({ name }) => !(isDoctor && name === PatientColumn.Läkare))
                  .map(({ name }) => (
                    <PatientTableHeaderResolver key={name} column={name} />
                  ))}
              </tr>
            )}
          </div>
        </div>
      </thead>
    </>
  )
}

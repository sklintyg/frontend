import type React from 'react'
import { useHistory } from 'react-router-dom'
import ExpandableTableRow from '../../components/Table/ExpandableTableRow'
import SimpleTable from '../../components/Table/SimpleTable'
import { START_URL, START_URL_FOR_ADMINISTRATORS } from '../../constants'
import { clearPatient } from '../../store/patient/patientActions'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { setUnit } from '../../store/user/userActions'
import {
  getCareProviders,
  getLoggedInUnit,
  isCareAdministrator as selectIsCareAdministrator,
  getUnitStatistics as selectUnitStatistics,
} from '../../store/user/userSelectors'
import type { CareUnit, Unit } from '../../types'
import { CareProviderModalContentRow } from './CareProviderModalContentRow'

function getUnitStatisticsLiteral(amountOnUnit: number, amountOnOtherUnit = 0, careUnit?: CareUnit) {
  const showTotal = careUnit && careUnit?.units.length > 0 && amountOnOtherUnit > 0
  return `${amountOnUnit} ${showTotal ? `(totalt ${amountOnUnit + amountOnOtherUnit})` : ''}`
}

export function CareProviderModalContent() {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const careProviders = useAppSelector(getCareProviders)
  const isCareAdministrator = useAppSelector(selectIsCareAdministrator)
  const unitStatistics = useAppSelector(selectUnitStatistics)
  const loggedInUnit = useAppSelector(getLoggedInUnit)
  const hasStatistics = Object.keys(unitStatistics).length > 0

  const handleChooseUnit = (event: React.MouseEvent) => {
    const unitId = event.currentTarget.id
    dispatch(clearPatient())
    dispatch(setUnit(unitId))

    history.push(isCareAdministrator ? START_URL_FOR_ADMINISTRATORS : START_URL)
  }

  const isLoggedInUnit = (unit: Unit) => {
    return unit.unitId === loggedInUnit?.unitId
  }

  const getStatistics = (id: string) => {
    return hasStatistics
      ? {
          questionsOnUnit: unitStatistics[id]?.questionsOnUnit ?? 0,
          questionsOnSubUnits: unitStatistics[id]?.questionsOnSubUnits ?? 0,
          draftsOnUnit: unitStatistics[id]?.draftsOnUnit ?? 0,
          draftsOnSubUnits: unitStatistics[id]?.draftsOnSubUnits ?? 0,
        }
      : undefined
  }

  const getUnitName = (unit: Unit) => {
    if (isLoggedInUnit(unit)) {
      return `${unit.unitName} (vald enhet)`
    }

    return unit.unitName
  }

  return (
    <>
      {careProviders.map((careProvider, index) => {
        return (
          <div key={index} className="iu-mb-800">
            <SimpleTable
              headings={[
                {
                  title: careProvider.missingSubscription ? `${careProvider.name} (Abonnemang saknas)` : careProvider.name,
                  adjustCellToText: false,
                },
                ...(hasStatistics
                  ? [
                      { title: 'Ej hanterade ärenden', adjustCellToText: true },
                      { title: 'Ej signerade utkast', adjustCellToText: true },
                    ]
                  : []),
              ]}
              key={careProvider.id}
            >
              {careProvider.careUnits.map((careUnit: CareUnit) => {
                const statistics = getStatistics(careUnit.unitId)
                const careUnitHasUnits = careUnit.units.length > 0

                return careUnitHasUnits ? (
                  <ExpandableTableRow
                    rowContent={[
                      getUnitName(careUnit),
                      ...(statistics
                        ? [
                            getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit),
                            getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit),
                          ]
                        : []),
                    ]}
                    id={careUnit.unitId}
                    handleClick={handleChooseUnit}
                    key={careUnit.unitId}
                    disabled={isLoggedInUnit(careUnit)}
                  >
                    {careUnit.units.map((unit) => {
                      const unitStatistics = getStatistics(unit.unitId)
                      return (
                        <CareProviderModalContentRow
                          key={unit.unitId}
                          unit={unit}
                          name={getUnitName(unit)}
                          questionsOnUnit={unitStatistics && getUnitStatisticsLiteral(unitStatistics.questionsOnUnit)}
                          draftsOnUnit={unitStatistics && getUnitStatisticsLiteral(unitStatistics.draftsOnUnit)}
                          loggedIn={isLoggedInUnit(unit)}
                          expanded
                          onChoose={handleChooseUnit}
                        />
                      )
                    })}
                  </ExpandableTableRow>
                ) : (
                  <CareProviderModalContentRow
                    key={careUnit.unitId}
                    unit={careUnit}
                    name={getUnitName(careUnit)}
                    loggedIn={isLoggedInUnit(careUnit)}
                    onChoose={handleChooseUnit}
                    questionsOnUnit={
                      statistics && getUnitStatisticsLiteral(statistics.questionsOnUnit, statistics.questionsOnSubUnits, careUnit)
                    }
                    draftsOnUnit={statistics && getUnitStatisticsLiteral(statistics.draftsOnUnit, statistics.draftsOnSubUnits, careUnit)}
                  />
                )
              })}
            </SimpleTable>
          </div>
        )
      })}
    </>
  )
}

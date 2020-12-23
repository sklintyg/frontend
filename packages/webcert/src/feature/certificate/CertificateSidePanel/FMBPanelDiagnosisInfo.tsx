import React from 'react'
import {
  ButtonTooltip,
  FMB_ACTIVITY_LIMITATION,
  FMB_WORK_CAPACITY,
  FMB_DIAGNOSIS,
  FMB_DISABILITY,
  FMB_GENERAL_INFO,
  FMB_REHABILITATION_INFORMATION,
  FMB_SYMPTOM_PROGNOSIS_TREATMENT,
  FMBDiagnosisCodeInfo,
  FMBDiagnosisCodeInfoForm,
  FMBDiagnosisCodeInfoFormContent,
  ExpandableText,
} from '@frontend/common'
import LaunchIcon from '@material-ui/icons/Launch'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import styled, { css } from 'styled-components/macro'
import { Link } from 'react-router-dom'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

const SubHeader = styled.p`
  font-size: 14px;
  font-weight: bold;
`

const alignCenter = css`
  display: flex;
  align-items: center;
`

interface Props {
  diagnosisCodes: FMBDiagnosisCodeInfo[]
  selectedDiagnosisIndex: number
}

const FMBPanelDiagnosisInfo: React.FC<Props> = ({ diagnosisCodes, selectedDiagnosisIndex }) => {
  const maxTextLength = 300

  return (
    <>
      <Root>
        <div className="iu-p-500">
          <SubHeader css={alignCenter}>
            Vägledning för sjukskrivning
            <ButtonTooltip
              description={'Vägledning för sjukskrivning vid ' + diagnosisCodes[selectedDiagnosisIndex].icd10Description + '.'}>
              <InfoOutlinedIcon className="iu-ml-200 iu-mb-200" />
            </ButtonTooltip>
          </SubHeader>
          <ul>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMB_WORK_CAPACITY)
              .map((form: FMBDiagnosisCodeInfoForm) =>
                form.content[0].list?.map((item: string, index: number) => (
                  <li key={index} className="iu-mt-300">
                    {item}
                  </li>
                ))
              )}
          </ul>
        </div>
        <p className="iu-pt-400 iu-fw-heading iu-bg-grey-300">{diagnosisCodes[selectedDiagnosisIndex].icd10Description}</p>
        <div className="iu-p-500">
          <p css={alignCenter} className={`iu-fw-heading iu-fs-200`}>
            Relaterade diagnoskoder (ICD-10-SE)
            <ButtonTooltip description="Informationen nedan gäller för angivna diagnoskoder, men kan även vara relevant för fler diagnoskoder.">
              <InfoOutlinedIcon className="iu-ml-200 iu-mb-200" />
            </ButtonTooltip>
          </p>
          <div>{diagnosisCodes[selectedDiagnosisIndex].relatedDiagnoses}</div>
        </div>
        <div className="iu-p-500">
          <SubHeader>Funktionsnedsättning</SubHeader>
          {diagnosisCodes[selectedDiagnosisIndex].forms
            .filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMB_DISABILITY)
            .map((form: FMBDiagnosisCodeInfoForm) => (
              <ExpandableText key={form.name} text={form.content[0].text ?? ''} maxLength={maxTextLength} />
            ))}
        </div>
        <div className="iu-p-500">
          <SubHeader>Aktivitetsbegränsning</SubHeader>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMB_ACTIVITY_LIMITATION)
              .map((form: FMBDiagnosisCodeInfoForm) => (
                <ExpandableText key={form.name} text={form.content[0].text ?? ''} maxLength={maxTextLength} />
              ))}
          </div>
        </div>
        <div className="iu-p-500">
          <SubHeader>Information om rehabilitering</SubHeader>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMB_REHABILITATION_INFORMATION)
              .map((form: FMBDiagnosisCodeInfoForm) => (
                <ExpandableText key={form.name} text={form.content[0].text ?? ''} maxLength={maxTextLength} />
              ))}
          </div>
        </div>
        <div className="iu-p-500">
          <SubHeader>Försäkringsmedicinsk information</SubHeader>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMB_DIAGNOSIS)
              .map((form: FMBDiagnosisCodeInfoForm) =>
                form.content
                  .filter((content: FMBDiagnosisCodeInfoFormContent) => content.heading === FMB_GENERAL_INFO)
                  .map((content: FMBDiagnosisCodeInfoFormContent) => (
                    <ExpandableText key={content.heading} text={content.text ?? ''} maxLength={maxTextLength} />
                  ))
              )}
          </div>
        </div>
        <div className="iu-p-500">
          <SubHeader>Symtom, prognos, behandling</SubHeader>
          <div>
            {diagnosisCodes[selectedDiagnosisIndex].forms
              .filter((form: FMBDiagnosisCodeInfoForm) => form.name === FMB_DIAGNOSIS)
              .map((form: FMBDiagnosisCodeInfoForm) =>
                form.content
                  .filter((content: FMBDiagnosisCodeInfoFormContent) => content.heading === FMB_SYMPTOM_PROGNOSIS_TREATMENT)
                  .map((content: FMBDiagnosisCodeInfoFormContent) => (
                    <ExpandableText key={content.heading} text={content.text ?? ''} maxLength={maxTextLength} />
                  ))
              )}
          </div>
        </div>
        <div className={`iu-p-500 iu-bg-grey-300`}>
          <p className="iu-fw-heading">Mer information</p>
          <div>
            <Link css={alignCenter} className="iu-fs-200" target="_blank" to={diagnosisCodes[selectedDiagnosisIndex].referenceLink}>
              <p css={alignCenter} className="iu-fs-200">
                {diagnosisCodes[selectedDiagnosisIndex].referenceDescription}
              </p>
              <LaunchIcon className="iu-ml-200 iu-fs-100" />
            </Link>
          </div>
        </div>
      </Root>
    </>
  )
}

export default FMBPanelDiagnosisInfo

import { ValuesWrapper } from './Styles'

interface IcfChosenValuesProps {
  collectionsLabel: string
  chosenIcfCodeValues: string[] | undefined
}

const IcfChosenValues = ({ collectionsLabel, chosenIcfCodeValues }: IcfChosenValuesProps) => {
  return (
    <div className={'iu-p-300 iu-bg-grey-200 iu-mt-200 iu-mb-300'}>
      <p className={'iu-mb-200'}>{collectionsLabel}</p>
      <ValuesWrapper>
        {chosenIcfCodeValues?.map((code) => (
          <p key={code} className={'iu-bg-white iu-p-200 iu-fs-200 iu-radius-sm iu-border-black'}>
            {code}
          </p>
        ))}
      </ValuesWrapper>
    </div>
  )
}

export default IcfChosenValues
